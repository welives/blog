## 查看版本

```sh
docker version
```

## 镜像管理

### 拉取镜像

```sh
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

**作用**：从远程仓库(默认是 Docker Hub)拉取指定名称的镜像到本地。如果不指定标签(`tag`)，默认会拉取`latest`标签的镜像

**实战示例**

拉取最新版本的 Nginx 镜像

```sh
docker pull nginx:latest
```

### 搜索镜像

```sh
docker search [OPTIONS] TERM
```

**作用**：在 Docker Hub 中搜索具有特定名称的镜像。这个命令非常有用，因为它可以帮助你快速找到需要的镜像

**实战示例**

搜索远程仓库中的 Nginx 镜像

```sh
docker search nginx
```

### 查看本地镜像

```sh
docker images
```

**作用**：列出本地所有已下载的 Docker 镜像。它显示的信息包括镜像的仓库名、标签、镜像 ID、创建时间和大小等

### 删除镜像

```sh
docker rmi [OPTIONS] IMAGE [IMAGE...]
```

**作用**：删除本地存储的一个或多个 Docker 镜像。如果有容器正在使用该镜像，则需要先删除那些容器，或者使用`-f`参数强制删除

**实战示例**

删除本地的旧版 Ubuntu 镜像

```sh
docker rmi ubuntu:18.04
```

### 构建镜像

```sh
docker build [OPTIONS] PATH | URL | -
```

**作用**：用于根据`Dockerfile`的指令创建 Docker 镜像。这个过程包括读取`Dockerfile`中的指令，然后按顺序执行这些指令来构建最终的镜像。每一个指令都可能创建一个新的层，这些层一起组成了整个镜像

**常用参数**

1. **`-t、--tag`**：为构建的镜像指定一个名字和标签，通常的格式为`name:tag`

   - 示例：`docker build -t my-image:1.0 .`

2. **`-f、--file`**：指定一个不在默认位置的`Dockerfile`

   - 示例：`docker build -f /your_path/Dockerfile -t my-image .`

3. **`--build-arg`**：允许你传递构建时的变量，这些变量在`Dockerfile`中可以被使用

   - 示例：`docker build --build-arg API_KEY=12345 -t my-image .`

4. **`--no-cache`**：构建镜像时不使用任何缓存，这保证了所有的层都是新构建的

   - 示例：`docker build --no-cache -t my-image .`

5. **`--rm`**：在镜像构建完成后自动删除中间产生的容器。这在大多数情况下会自动开启

   - 示例：`docker build --rm -t my-image .`

6. **`--pull`**：在构建之前尝试拉取更新的基础镜像

   - 示例：`docker build --pull -t my-image .`

7. **`-q、--quiet`**：构建过程中只显示必要信息，减少输出的干扰

   - 示例：`docker build -q -t my-image .`

8. **`.`**：在 Docker 中`.`表示当前目录，意味着 Docker 将在当前目录中查找`Dockerfile`和所有`构建上下文`

   - **构建上下文**：Docker 构建镜像时所需要的文件和文件夹

#### 实战示例

- 构建一个简单的 web 服务器镜像

```sh
# 假设当前目录有一个 Dockerfile
docker build -t my-webserver:latest .
```

- 构建一个指定镜像版本的镜像

```sh
# 假设当前目录有一个 Dockerfile
docker build -t my-webserver:1.0.0 .
```

## 容器管理

### 列出运行中的容器

```sh
docker ps
```

**作用**：显示所有当前运行中的容器实例的简要信息，包括容器 ID、创建时间、使用的镜像等

### 列出所有容器

```sh
docker ps -a
```

**作用**：列出系统中所有的容器，包括运行中的和已停止的

### 运行容器

```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**作用**：从指定的镜像启动一个新的容器实例。这是 Docker 中最常用的命令之一，它允许用户从一个镜像中创建并启动一个或多个容器

**选项示例**

- `-d`：后台运行容器，是`--detach`的简写。运行成功的话会返回容器 ID
- `--name`：为容器指定一个名称，此处命名为`docker-nginx`
- `-p`：端口映射，将容器的 80 端口映射到宿主机的 8080 端口

**实战示例**

启动一个 Nginx 服务器，并且通过宿主机的 8080 端口来访问此 Nginx 服务器

```sh
docker run -d -p 8080:80 --name docker-nginx nginx
```

### 在运行的容器中执行命令

```sh
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

**作用**：在已运行的容器内执行指定命令。这使得用户可以进入容器内部进行操作，如安装软件、修改配置文件或进行故障诊断

**实战示例**

```sh
docker exec -it acca75d5d18a /bin/bash
```

- 这个命令的意思是在指定的 Docker 容器中开启一个交互式`bash`终端，这使得你可以在容器的环境中手动执行更多命令，就像在一个常规的 Linux 终端中操作一样
  - `-it`：这个参数组合有两部分。`-i` 代表“交互式”，让容器的标准输入保持开启。`-t` 代表分配一个伪终端
  - `acca75d5d18a`：容器 ID，可以通过`docker ps`命令查看
  - `/bin/bash`：要执行的命令，这里以`/bin/bash`为例，表示进入容器的终端

### 停止容器

```sh
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

**作用**：停止一个或多个运行中的容器

### 启动已停止的容器

```sh
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

**作用**：启动一个或多个之前已经创建并停止的容器

### 重启容器

```sh
docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

**作用**：重启一个或多个容器，这对于需要重新加载配置或恢复服务的快速方法很有用

### 删除容器

```sh
docker rm [OPTIONS] CONTAINER [CONTAINER...]
```

**作用**：删除一个或多个已停止的容器。如果容器正在运行，需要先用`docker stop`停止它或使用`-f`选项强制删除

### 暂停容器

```sh
docker pause CONTAINER [CONTAINER...]
```

**作用**：暂停一个或多个容器中的所有进程

### 恢复容器

```sh
docker unpause CONTAINER [CONTAINER...]
```

**作用**：恢复被暂停的容器中的所有进程

### 查看容器日志

```sh
docker logs [OPTIONS] CONTAINER
```

**作用**：获取容器的日志输出。对于调试容器应用或监控容器内部发生的事件非常有用

### 把容器的文件拷贝出来

要从 Docker 容器中拷贝文件到宿主机，你可以使用`docker cp`命令

```sh
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
```

- `CONTAINER`：容器名或ID
- `SRC_PATH`：容器内文件或目录的路径，你想要从中拷贝的源数据
- `DEST_PATH`：宿主机上的目标路径，将文件或目录拷贝到这里

**实战示例**

假设你想从一个ID为`86209c1694e6`的 Nginx 容器中拷贝其配置文件到宿主机的当前目录中，可以使用如下命令

```sh
docker cp 86209c1694e6:/etc/nginx/nginx.conf .
```

如果你想要从容器中拷贝某个目录，只需要指定目录的路径即可。例如，将容器中的`/var/log`目录拷贝到宿主机的`/home/user/logs`目录

```sh
docker cp 86209c1694e6:/var/log /home/user/logs
```

## 网络管理

### 列出所有网络

```sh
docker network ls [OPTIONS]
```

**作用**：列出 Docker 主机上的所有网络。Docker 支持不同类型的网络，如`bridge`、`host`和`none`等，默认情况下会创建一个`bridge`网络

### 检查网络

```sh
docker network inspect [OPTIONS] NETWORK [NETWORK...]
```

**作用**：显示一个或多个 Docker 网络的详细信息。这些信息包括网络的类型、所连接的容器、IP分配等，是理解网络配置和排查网络问题的重要工具

**实战示例**

查看默认`bridge`网络的详细信息

```sh
docker network inspect bridge
```

### 创建网络

```sh
docker network create [OPTIONS] NETWORK
```

**作用**：创建一个新的 Docker 网络。你可以指定网络的类型(如`bridge`、`overlay`等)，也可以配置网络的参数(如子网、网关等)

**实战示例**

在需要隔离容器通信或跨主机容器通信时，往往需要创建自定义网络。例如，创建一个带有特定子网的`bridge`网络

```sh
docker network create --driver bridge --subnet 192.168.1.0/24 my-bridge
```

### 删除网络

```sh
docker network rm NETWORK [NETWORK...]
```

**作用**：删除指定的一个或多个网络

### 连接容器到网络

```sh
docker network connect [OPTIONS] NETWORK CONTAINER
```

**作用**：将一个已经运行的容器连接到一个网络。这允许你动态地改变容器的网络配置，无需重启容器

### 断开容器与网络的连接

```sh
docker network disconnect [OPTIONS] NETWORK CONTAINER
```

**作用**：将一个容器从一个网络中断开

## 卷管理

### 列出卷

```sh
docker volume ls [OPTIONS]
```

**作用**：显示所有在 Docker 主机上创建的卷。这个命令允许你快速查看哪些卷是可用的，以及识别未再使用的卷

### 创建卷

```sh
docker volume create [OPTIONS] [VOLUME]
```

**作用**：创建一个新的卷，用于数据持久化或在多个容器间共享数据。Docker 卷存储在宿主机上，独立于容器的生命周期，即使容器被删除，卷中的数据也不会丢失

**实战示例**

当你准备启动一个数据库容器并希望数据库文件持久化时，首先创建一个卷，然后在运行容器时，将这个卷挂载到容器的数据目录

```sh
docker volume create dbdata
```

### 删除卷

```sh
docker volume rm [OPTIONS] VOLUME [VOLUME...]
```

**作用**：删除指定的一个或多个卷。如果卷正被某个容器使用，则无法删除，除非使用强制删除选项

**实战示例**

清理未使用的卷以释放空间：首先确认卷不再被任何容器使用，然后删除它

```sh
docker volume rm dbdata
```

## Docker Compose

Docker Compose 是一个用于定义和运行多容器的 Docker 应用程序的工具。通过一个`YAML`文件来配置应用服务，然后只需一个简单的命令，就可以创建并启动所有服务

### 查看版本

```sh
docker-compose version
```

### 构建服务并后台运行

```sh
docker compose up --build -d
```

**作用**：先构建服务所需的镜像，然后在后台启动服务。这个命令适用于开发环境，当你做了代码更改后，需要重新构建镜像并重启服务

- **`--build`** 选项确保了即使之前构建过镜像，也会重新构建镜像，这对于确保使用的是最新代码和依赖非常有用

- **`-d`** 选项表示在后台运行容器

### 停止服务

```sh
docker compose start
```

**作用**：启动由`docker-compose.yml`文件定义的所有服务，但前提是这些服务之前已被创建并停止

### 重建并启动服务

```sh
docker compose up --build
```

**作用**：与`docker compose up --build -d`相似，但服务会在前台运行。如果服务已经运行，会先停止并移除现有的容器，然后根据最新的配置和代码构建镜像并启动服务

### 停止并移除容器、网络、卷

```sh
docker compose down
```

**作用**：停止并移除由`docker-compose.yml`文件定义的所有服务的容器，以及网络和默认管理的卷。这条命令不会移除手动指定的外部卷

## 清理资源

对于日常的 Docker 使用，可能会产生大量的未使用或临时的容器、镜像、卷和网络。Docker 提供了方便的命令来清理这些资源，帮助维护 Docker 环境的整洁

### 删除所有为none的镜像

在 PowerShell中，删除 Docker 中标记为 `<none>` 的镜像，你可以使用以下命令

```sh
docker images | Select-String none | ForEach-Object { docker rmi ($_.ToString() -split '\s+')[2] }
```

在 macOS 或者 Linux 中，你可以使用以下命令来删除 Docker 中标记为 `<none>` 的镜像

```sh
docker images | grep '<none>' | awk '{ print $3 }' | xargs docker rmi
```

### 删除所有停止的容器

```sh
docker container prune [OPTIONS]
```

### 删除未使用的镜像

```sh
docker image prune [OPTIONS]
```

### 删除未使用的网络

```sh
docker network prune [OPTIONS]
```

### 删除未使用的卷

```sh
docker volume prune [OPTIONS]
```

### 一键清理未使用的容器、网络、镜像、卷

```sh
docker system prune [OPTIONS]
```

**作用**：这个命令将清除所有未使用的容器、网络、悬挂的镜像（默认不清理卷）。如果你想要在清理过程中包括卷，可以添加`-a`和`--volumes`选项
