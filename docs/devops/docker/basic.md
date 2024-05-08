---
title: Docker基础
head:
  - - meta
    - name: description
      content: Docker基础
  - - meta
    - name: keywords
      content: docker 容器 镜像 基础
---

> 如果在 Windows 上还没搭建好基础的 docker 运行环境的话，去这里看：[启用 Windows 的 WSL 功能](/misc/win10-dev-environment.html#enable-wsl)和[安装 Docker](/misc/win10-dev-environment.html#install-docker)

## docker 是什么

Docker 是一个应用打包、分发、部署的工具

如果你是初次接触Docker的话可以把它理解为一个轻量的虚拟机，但也要记住它本质上并不是虚拟机。它只是虚拟出一个你的软件运行所需要的环境，多余的一点都不要；而通常的虚拟机则是一个完整而庞大的系统，包含各种你用得上或用不上的软件

### 一些概念

- `image`：镜像是一个轻量级、可执行的独立软件包，它包括运行应用程序所需的一切：代码、运行时环境、库、环境变量和配置文件等
- `container`：容器是镜像的运行实例。当你运行镜像时，Docker 会在容器中启动一个进程，包括应用和其依赖，隔离于其他容器和主机系统
- `Dockerfile`：一个文本文件，它包含了一系列的命令和参数，这些命令被 Docker 用来自动构建镜像。简而言之，`Dockerfile`定义了创建 Docker 镜像所需的环境、文件添加、命令执行等步骤
- `docker-compose`：一个用于定义和运行多容器的 Docker 应用配置文件。可以简单理解为它是团队的Leader，负责团队成员(容器)之间的协同工作

::: tip 提示
它们之间的关系是，`通过Dockerfile构建出镜像，然后通过镜像来创建容器，程序就跑在容器中`。并且一个镜像可以随意创建多个容器，各个容器间相互隔离。多个容器之间可以根据`docker-compose`的指挥进行协同工作，构建出一个复杂完整的应用
:::

## Dockerfile

### 常用指令

- **`FROM`**：指定基础镜像。所有`Dockerfile`都必须从一个基础镜像开始，这个镜像可以是官方的，也可以是自己创建的
- **`WORKDIR`**：设置工作目录。用于定义后续命令的执行环境路径
- **`COPY`**：复制文件。也就是将本地项目文件复制到镜像中
- **`ADD`**：更高级的复制文件。在`COPY`的基础上增加了自动解压文件和从 URL 下载文件的功能。官方推荐使用`COPY`，因为它语义更明确
- **`RUN`**：执行命令。在构建镜像阶段执行
- **`CMD`**：也是执行命令。在容器启动时执行
- **`EXPOSE`**：指示容器监听的端口
- **`ARG`**：设置环境变量。只在构建镜像阶段生效
- **`ENV`**：也是设置环境变量。构建镜像阶段和容器运行阶段都生效
- **`VOLUME`**：创建一个挂载点来持久化数据

## Docker 快速安装软件

在过去，我们上手一台新机器时总会需要到处下载各种软件来搭建开发环境或运行环境，这个过程比较繁琐，而Docker很好的解决的这一痛点

**直接安装的缺点**

- 安装麻烦，可能有各种依赖，运行报错
- 可能对 Windows 并不友好，运行有各种兼容问题，软件只支持 Linux 上跑
- 不方便安装多版本软件，不能共存
- 不同系统和硬件，安装方式不一样
- 卸载不彻底，经常有各种残留的缓存文件

**Docker 安装的优点**

- 一个命令就可以安装好，快速方便
- 有大量的镜像，可直接使用
- 没有系统兼容问题，Linux 专享软件也照样跑
- 支持软件多版本共存
- 不同系统和硬件，只要安装好 Docker 其他都一样了，一个命令搞定所有
- 用完就删，没有残留

### 安装个 Nginx 试试

```sh
# 下载一个镜像
docker pull nginx
# 使用镜像启动一个容器
docker run -d -p 8080:80 --name docker-nginx nginx
# 这里 -d 的意思是让容器后台运行，-p 的意思是进行端口转发，其中冒号左边的是宿主机要访问的端口，右边的是容器内部的端口
```

好了，这样就得到了一个 Nginx 服务，是不是超级简单？接着来试试访问下 `127.0.0.1:8080`，在终端输入`curl 127.0.0.1:8080`，或者在浏览器中打开

## 来做一个简单的 Hello World 镜像

1. 在 WSL 中的任意目录下(_我这里是`/home`_)新建一个`demo`目录，接着输入

```sh
cd demo
echo 'console.log("hello world")' > ./index.js
```

2. 然后再创建一个`Dockerfile`文件，内容如下

```sh
FROM node
WORKDIR /demo
COPY . ./
CMD node index.js
```

简单解释一下这几个指令

- `FROM node`：以最新版本的 node 镜像为基础进行构建
- `WORKDIR /demo`：设置容器启动后的默认工作目录
- `COPY . ./`：拷贝当前目录下的所有文件到工作目录，当然也可以使用`.dockerignore`来排除不需要打包的文件
- `CMD node index.js`：CMD 指令只能有一个，是容器启动后执行的命令，算是程序的入口

1. 构建镜像，在`Dockerfile`文件所在目录下执行`docker image build -t demo .`
2. 构建完毕后运行容器`docker run demo`

最后就会在终端中看到输出的`hello world`

> 如果安装的是`Docker Desktop`，那么构建镜像并不一定非得在 WSL 中进行，也可以在宿主机中进行
