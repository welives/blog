# 阶段一：安装依赖
#
# 使用官方Node.js 20镜像
FROM node:20 as dependency-stage
# 设置工作目录为/app
WORKDIR /app
# 复制项目的package.json和package-lock到工作目录
COPY package.json package-lock.* .npmrc ./
# 安装项目依赖，使用中国镜像加速
RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm install --registry=https://registry.npmmirror.com

# 阶段二：构建应用
#
# 以阶段一作为运行环境
FROM dependency-stage as build-stage
# 复制项目所有文件到工作目录
COPY . .
# 构建项目
RUN pnpm run build

# 阶段三：生产部署
#
# 使用官方nginx:latest镜像
FROM nginx:latest
# 删除ngnix的默认页面
RUN rm -rf /usr/share/nginx/html/*
# 删除nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 复制自定义nginx配置到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将阶段二构建产物复制到nginx的服务目录
COPY --from=build-stage /app/docs/.vitepress/dist /usr/share/nginx/html
# 暴露80端口
EXPOSE 80
# 将nginx转为前台进程
CMD ["nginx", "-g", "daemon off;"]
