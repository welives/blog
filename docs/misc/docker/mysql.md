---
title: Docker安装MySQL服务
---

## 下载MySQL镜像

这里以`MySQL 5.7`为例，下载官方镜像

```sh
docker pull mysql:5.7
```

## 创建MySQL容器

### 方式一

直接启动容器，数据目录保存在容器中

```sh
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 --name MySQL-5.7 mysql:5.7
```

进入容器

```sh
docker exec -it MySQL-5.7 bash
mysql -u root -p
```

建库授权

```sql
-- 创建用户并开启远程登录
CREATE USER '账号'@'%' IDENTIFIED BY '密码';
-- 建库
CREATE DATABASE `库名` CHARACTER SET 'utf8mb4';
-- 给账号授权数据库
GRANT ALL PRIVILEGES ON `库名`.* TO '账号'@'%';
-- 刷新权限
FLUSH PRIVILEGES;
```

### 方式二

在宿主机创建目录映射到容器

```sh
# 数据目录
mkdir -p /home/jandan/docker_data/mysql/data
# 日志目录
mkdir -p /home/jandan/docker_data/mysql/logs
# 配置目录
mkdir -p /home/jandan/docker_data/mysql/conf
mkdir -p /home/jandan/docker_data/mysql/conf/conf.d
mkdir -p /home/jandan/docker_data/mysql/conf/mysql.conf.d
```

启动容器

```sh
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -v /home/jandan/docker_data/mysql/data:/var/lib/mysql -v /home/jandan/docker_data/mysql/logs:/var/log/mysql -v /home/jandan/docker_data/mysql/conf:/etc/mysql --name MySQL-5.7 mysql:5.7
```

进入容器

```sh
docker exec -it MySQL-5.7 bash
mysql -u root -p
```

建库授权

```sql
-- 创建用户并开启远程登录
CREATE USER '账号'@'%' IDENTIFIED BY '密码';
-- 建库
CREATE DATABASE `库名` CHARACTER SET 'utf8mb4';
-- 给账号授权数据库
GRANT ALL PRIVILEGES ON `库名`.* TO '账号'@'%';
-- 刷新权限
FLUSH PRIVILEGES;
```
