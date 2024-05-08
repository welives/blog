---
title: Docker安装Nginx服务
head:
  - - meta
    - name: description
      content: Docker安装Nginx服务
  - - meta
    - name: keywords
      content: docker 容器 镜像 nginx
---

## 拉取Nginx镜像

使用 Docker 命令从 Docker Hub 拉取最新的 Nginx 镜像

```bash
docker pull nginx
```

## 运行Nginx容器

Nginx 镜像被拉取完成后，可以通过以下命令运行一个 Nginx 容器

```bash
docker run -d -p 8080:80 --name docker-nginx nginx
```

这条命令做了几件事情：

- `--name docker-nginx`：给你的容器命名为 `docker-nginx`
- `-d`：表示后台运行容器
- `-p 8080:80`：将容器的 80 端口映射到宿主机的 8080 端口。这意味着你可以通过访问宿主机的 8080 端口来访问 Nginx

## 验证Nginx运行情况

在浏览器中输入 `http://localhost:8080` 或者使用命令行工具如 curl：`curl http://localhost:8080`。您应该能看到 Nginx 的欢迎页面，这表示 Nginx 正在运行

## 自定义配置

你可能想根据需要自定义 Nginx 的配置。要做到这一点，您可以创建一个自定义的 Nginx 配置文件，并在启动容器时将其挂载到容器内部。例如

```bash
docker run -d -p 8080:80 -v /your_path/content:/usr/share/nginx/html:ro -v /your_path/nginx.conf:/etc/nginx/nginx.conf:ro --name docker-nginx nginx
```

- `-v /your_path/content:/usr/share/nginx/html:ro`：意思是将你宿主机中打包好的静态网站内容挂载到容器的 Nginx 服务器目录下
- `-v /your_path/nginx.conf:/etc/nginx/nginx.conf:ro`：意思是将你的 Nginx 配置文件挂载到容器中的正确位置
