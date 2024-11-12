---
title: Docker容器通信
head:
  - - meta
    - name: description
      content: Docker容器通信
  - - meta
    - name: keywords
      content: docker 容器 网络 通信
---

## Docker容器间的通信

这里以我的一个[Next.js实战项目为例](https://github.com/welives/nextjs-study)

这个项目涉及了三个容器，其中一个以`PostgreSQL`官方镜像直接构建容器，用来提供数据库服务，另外两个分别是以`Nodejs`和`Nginx`的官方镜像为基础构建了自定义镜像

### 开发环境

- 首先是创建docker网络

执行这个命令`docker network create -d bridge next-study` 创建一个名为`next-study`的桥接网络给当前项目内的所有容器进行使用

- 接着编写一个数据库的`compose`配置

在这个`Nextjs`项目中，我是把所有的 Docker 配置都放在根目录下的`docker`文件夹内，比如下面的这个`compose`配置，其路径就是`docker/database.yml`

然后执行`docker compose -f docker/database.yml --env-file .env.database up --build -d` 便可以构建并运行容器了

当容器启动成功后，即可执行`pnpm dev`进入开发模式

开发模式访问数据库是通过容器映射出来的`5432`端口实现的，所以数据库连接写成`postgres://postgres:password@localhost:5432/next-admin`，就跟访问本地数据库一样

```yml
# 设置容器名词
name: next-study-database

# 设置网络, 这里表示加入一个外部网络 next-study
networks:
  next-study:
    external: true
    driver: bridge

services:
  # 主数据库
  postgres_db:
    image: postgres:14-alpine
    # 容器名
    container_name: postgres_db
    restart: always
    # 环境变量读取自 .env.database 文件
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      TZ: ${TIMEZONE}
    volumes:
      - '../.volumes/main_db:/var/lib/postgresql/data'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready']
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - 5432:5432
    networks:
      - next-study

# 卷标定义
volumes:
  data:
    driver: local
```

### 生产环境

当需要进行生产部署时，还得再构建以下两个自定义镜像

- `Nginx`镜像

在项目根目录创建`nginx/Dockerfile`和`nginx/default.conf`文件

:::code-group

```dockerfile [Dockerfile]
FROM nginx:alpine
# 删除ngnix的默认页面
RUN rm -rf /usr/share/nginx/html/*
# 删除nginx默认配置
RUN rm -rf /etc/nginx/conf.d/*
# 复制自定义nginx配置到容器中
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
EXPOSE 80
# 将nginx转为前台进程
CMD ["nginx", "-g", "daemon off;"]
```

```nginx [default.conf]
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=1d use_temp_path=off;

# 负载均衡
upstream nextjs_upstream {
  # 这个 nextjs 表示的是docker容器名, 对象下面的nextjs应用的容器
  server nextjs:3000;
}

server {
    listen       80;
    listen  [::]:80;

    server_name _;
    server_tokens off;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://nextjs_upstream;
    }

    location /static {
      proxy_cache STATIC;
      proxy_ignore_headers Cache-Control;
      proxy_cache_valid 60m;
      proxy_pass http://nextjs_upstream;
    }

    location / {
        proxy_pass http://nextjs_upstream;
    }
}
```
:::

- `Nextjs`应用生产的镜像

在项目根目录创建`docker/production/Dockerfile`和`docker/production/compose.yml`文件

:::code-group
```yml [compose.yml]
# 容器名
name: nextjs-study-production

networks:
  next-study:
    external: true
    driver: bridge

services:
  # 构建 nextjs 应用的容器
  nextjs:
    build:
      context: ../../
      dockerfile: docker/production/Dockerfile
    image: nextjs-study-production
    # 容器名
    container_name: nextjs
    # 使用外部的网络,以便进行容器通信
    networks:
      - next-study
  # nginx 容器
  nginx:
    build:
      context: ../../
      dockerfile: nginx/Dockerfile
    # 把nginx的80端口映射到宿主机的3000端口
    ports:
      - "3000:80"
    # 使用外部的网络,以便进行容器通信
    networks:
      - next-study
```

```dockerfile [Dockerfile]
FROM node:22-alpine AS base

# 1. 此阶段只用于安装项目的所需依赖
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. 将上一个阶段下载好的依赖提取出来并执行打包命令
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.example .env.production
RUN npm run build

# 3. 以上一个阶段打包好的产物为基础构建生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
```
:::

生产环境的这个`compose`配置同时运行了两个容器，并且加入了外部的`next-study`网络，从而能够和提供数据库服务的`postgres_db`容器进行通信

可以看到，`Nextjs`应用的容器并没有任何端口映射给宿主机，数据的通信全都是在容器之间进行的，不对外暴露，此时的`Nextjs`应用内的数据库连接就要变成`postgres://postgres:password@postgres_db:5432/next-admin`

这个数据库连接其实只是把原来的`localhost`给换成了`postgres_db`就行，这样就能通过容器名进行访问通信了

一切就绪，在命令行执行`docker compose -f docker/production/database.yml up --build -d`便可以构建并运行部署生产环境代码了


### 其他配置

在这个`Nextjs`项目中，我还使用了`Makefile`的方式来管理多个`Docker`环境的运行命令。要使用`Makefile`的话，需要安装`GCC`编译器，具体的安装方法可以看我另一篇笔记[GCC的配置](/misc/win10-dev-environment.html#gcc)

装好`GCC`之后，就可以使用类似如下的命令了

- 启动数据库服务：`make start-database`
- 停止数据库服务：`make stop-database`
- 构建生产环境：`make build-production`
- 部署生产环境：`make start-production`
- 停用生产环境：`make stop-production`

```makefile
.PHONY: start-database
start-database: ## Build the development docker image.
	docker compose -f docker/database.yml --env-file .env.database up --build -d

.PHONY: stop-database
stop-database: ## Build the development docker image.
	docker compose -f docker/database.yml --env-file .env.database down

.PHONY: build-development
build-development: ## Build the development docker image.
	docker compose -f docker/development/compose.yml build

.PHONY: start-development
start-development: ## Start the development docker container.
	docker compose -f docker/development/compose.yml up -d

.PHONY: stop-development
stop-development: ## Stop the development docker container.
	docker compose -f docker/development/compose.yml down

.PHONY: build-production
build-production: ## Build the production docker image.
	docker compose -f docker/production/compose.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	docker compose -f docker/production/compose.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	docker compose -f docker/production/compose.yml down
```
