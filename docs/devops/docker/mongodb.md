---
title: Docker安装MongoDB服务
head:
  - - meta
    - name: description
      content: Docker安装MongoDB服务
  - - meta
    - name: keywords
      content: docker 容器 镜像 mongodb
---

## 下载MongoDB镜像

这里以最新版本的MongoDB为例

```sh
docker pull mongo
```

## 创建MongoDB容器

### 无账号

```sh
docker run -d -p 27017:27017 --name my-mongo mongo
```

这样就创建好一个免验证的MongoDB服务了，可以通过`mongodb://localhost:27017`来连接数据库

### 需要账号

```sh
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=123456 --name my-mongo mongo --auth
```

::: tip 提示
环境变量`MONGO_INITDB_ROOT_USERNAME`和`MONGO_INITDB_ROOT_PASSWORD`用来设置初始的默认账号和密码

`--auth`的意思是需要密码才能访问容器服务，因为 MongoDB 默认是不开启权限验证的，这里就相当于修改了 MongoDB 的配置`auth=ture`启用权限访问
:::

或者先不设置账号密码，过后通过命令行进行设置

```sh
docker run -dit -p 27017:27017 --name my-mongo mongo --auth
```

进入容器，连接`admin`数据库

```sh
docker exec -it my-mongo mongosh admin
```

创建`root`用户并授权登录

```sh
db.createUser({ user:"root", pwd:"123456", roles:[{ role:"root", db:"admin"}] });
db.auth('root', '123456');
```

然后就可以使用`mongodb://root:123456@localhost:27017`来连接数据库了

## MongoDB添加用户命令说明

- `user`：用户的名字
- `pwd`：用户的密码
- `cusomData`：任意内容，一般在这里描述用户的额外信息
- `roles`：指定用户的角色，可以是内置角色或自定义的角色
  - `role`：角色名
  - `db`：数据库的名字

## MongoDB内置角色说明

- 数据库用户角色：`read`、`readWrite`
- 数据库管理角色：`dbAdmin`、`dbOwner`、`userAdmin`
- 集群管理角色：`clusterAdmin`、`clusterManager`、`clusterMonitor`、`hostManage`
- 备份恢复角色：`backup`、`restore`
- 所有数据库角色：`readAnyDatabase`、`readWriteAnyDatabase`、`userAdminAnyDatabase`、`dbAdminAnyDatabase`
- 超级用户角色：`root`
- 内部角色：`__system`

## MongoDB中的`role`详解

| 角色                   | 说明                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `read`                 | 允许用户读取指定数据库                                                              |
| `readWrite`            | 允许用户读写指定数据库                                                              |
| `dbAdmin`              | 允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问 system.profile |
| `userAdmin`            | 允许用户向 system.users 集合写入，可以在指定数据库里创建、删除和管理用户            |
| `clusterAdmin`         | 只在 admin 数据库中可用，赋予用户所有分片和复制集相关函数的管理权限                 |
| `readAnyDatabase`      | 只在 admin 数据库中可用，赋予用户所有数据库的读权限                                 |
| `readWriteAnyDatabase` | 只在 admin 数据库中可用，赋予用户所有数据库的读写权限                               |
| `userAdminAnyDatabase` | 只在 admin 数据库中可用，赋予用户所有数据库的 userAdmin 权限                        |
| `dbAdminAnyDatabase`   | 只在 admin 数据库中可用，赋予用户所有数据库的 dbAdmin 权限                          |
| `root`                 | 只在 admin 数据库中可用，超级账号，超级权限                                         |
