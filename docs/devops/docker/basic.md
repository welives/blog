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

你也可以把它理解为一个轻量的虚拟机，它只虚拟你软件需要的运行环境，多余的一点都不要，而通常的虚拟机则是一个完整而庞大的系统，包含各种不管你要不要的软件

### docker 的一些概念

- `image`：镜像，可以理解为软件安装包，可以方便的进行传播和安装
- `container`：容器，软件安装后的状态，每个软件运行环境都是独立的、隔离的，称之为容器
- `Dockerfile`：镜像构建的模版，描述镜像构建的步骤

::: tip
它们之间的关系是，`通过Dockerfile构建出镜像，然后通过镜像来创建容器，程序就跑在容器中`。并且一个镜像可以随意创建 N 个容器，各个容器间相互隔离。
:::

## Docker 快速安装软件

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
docker run -d -p 80:80 nginx
# 这里 -d 的意思是让容器后台运行，-p 的意思是进行端口转发，其中冒号左边的是宿主机要访问的端口，右边的是容器内部的端口
```

好了，这样就得到了一个 Nginx 服务，是不是超级简单？接着来试试访问下 127.0.0.1，在终端输入`curl 127.0.0.1`

## 来做一个简单的 Hello World 镜像

1. 在 WSL 中的任意目录下(_我这里是/home_)新建一个`demo`目录，接着输入

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
