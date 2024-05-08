# 阶段一：构建Vitepress应用
# 使用官方Node.js 20镜像作为构建环境
FROM node:20 as builder
# 设置工作目录为/app
WORKDIR /app
# 复制项目的package.json和package-lock到工作目录
COPY package.json package-lock.* ./
# 安装项目依赖，使用中国镜像加速
RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm install --registry=https://registry.npmmirror.com
# 复制项目所有文件到工作目录
COPY . .
# 构建Vitepress项目
RUN pnpm run build

# 阶段二：构建Nginx映像并复制Vitepress构建结果
# 使用官方nginx:latest镜像作为构建环境
FROM nginx:latest
# 暴露80端口
EXPOSE 80
# 删除nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 复制自定义nginx配置到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将阶段一构建的Vitepress应用复制到nginx的服务目录
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
