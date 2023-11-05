---
title: Koa使用Typeorm
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Typeorm`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## 安装`Typeorm`

```sh
pnpm add typeorm mysql2 reflect-metadata
```

如果用 MongoDB 的话

```sh
pnpm add typeorm mongodb reflect-metadata
```

## 数据库配置

安装下面两个依赖，用来实现模型的自动化导入

```sh
pnpm add -D require-context @types/webpack-env
```

新建数据库配置`src/config/db.ts`

::: code-group

```ts [mysql]
import { DataSource, DataSourceOptions } from 'typeorm'
// 自动加载所有模型
const moduleFiles = require.context('../models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath: string) => {
  const value = moduleFiles(modelPath)
  // 单个导出时
  // const [entity] = Object.values(value).filter((v) => typeof v === 'function' && v.toString().slice(0, 5) === 'class')
  // 默认导出时 [...model, value.default]
  return [...model, value.default]
}, [])
const MYSQL_URL = process.env.MYSQL_URL

const config: DataSourceOptions = {
  ...(MYSQL_URL
    ? { url: MYSQL_URL }
    : {
        host: process.env.MYSQL_HOST as string,
        port: parseInt(process.env.MYSQL_PORT as string),
        username: process.env.MYSQL_USER as string,
        password: process.env.MYSQL_PWD as string,
        database: process.env.MYSQL_DBNAME as string,
      }),
  type: 'mysql',
  timezone: process.env.TIMEZONE,
  charset: process.env.CHARSET,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities: models,
}

const DBSource = new DataSource(config)
export default DBSource
```

```ts [mongodb]
import { DataSource, DataSourceOptions } from 'typeorm'
// 自动加载所有模型
const moduleFiles = require.context('../models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath: string) => {
  const value = moduleFiles(modelPath)
  // 单个导出时
  // const [entity] = Object.values(value).filter((v) => typeof v === 'function' && v.toString().slice(0, 5) === 'class')
  // 默认导出时 [...model, value.default]
  return [...model, value.default]
}, [])
const MONGODB_URL = process.env.MONGODB_URL

const config: DataSourceOptions = {
  ...(MONGODB_URL
    ? { url: MONGODB_URL }
    : {
        host: process.env.MONGODB_HOST as string,
        port: parseInt(process.env.MONGODB_PORT as string),
        username: process.env.MONGODB_USER as string,
        password: process.env.MONGODB_PWD as string,
        database: process.env.MONGODB_DBNAME as string,
      }),
  type: 'mongodb',
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities: models,
}

const DBSource = new DataSource(config)
export default DBSource
```

:::

## 连接数据库

修改入口文件`src/index.ts`

```ts
import './env'
require('require-context/register') // [!code ++]
import 'reflect-metadata' // [!code ++]
import app from './app'
import DBSource from './config/db' // [!code ++]
const PORT = process.env.APP_PORT || 3000
// [!code focus:12]
DBSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log('数据库连接成功')
      console.info('Server listening on port: ' + PORT)
    })
  })
  .catch((err) => {
    console.error('数据库连接失败', err)
    process.exit(1)
  })
```

## 定义模型

新建模型`src/models/user.entity.ts`

::: code-group

```ts [mysql]
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
export enum UserStatus {
  NORMAL = 0, // 正常
  LOCKED = 1, // 锁定
  BANNED = 2, // 封禁
}
// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number
  @Column({ type: 'varchar', comment: '用户名' })
  username: string
  @Column({ type: 'varchar', comment: '密码' })
  password: string
  @Column({ type: 'varchar', comment: '加密盐' })
  salt: string
  @Column({ type: 'varchar', default: '', comment: '头像' })
  avatar: string
  @Column({ type: 'tinyint', default: 0, comment: '角色' })
  role: number
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NORMAL, comment: '状态' })
  status: UserStatus
}
```

```ts [mongodb]
import { Entity, Column, ObjectId, ObjectIdColumn } from 'typeorm'
export enum UserStatus {
  NORMAL = 0, // 正常
  LOCKED = 1, // 锁定
  BANNED = 2, // 封禁
}
@Entity({ name: 'user' })
export default class User {
  @ObjectIdColumn()
  id: ObjectId
  @Column({ type: 'string', comment: '用户名' })
  username: string
  @Column({ type: 'string', comment: '密码' })
  password: string
  @Column({ type: 'string', comment: '加密盐' })
  salt: string
  @Column({ type: 'string', default: '', comment: '头像' })
  avatar: string
  @Column({ type: 'number', default: 0, comment: '角色' })
  role: number
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NORMAL, comment: '状态' })
  status: UserStatus
}
```

:::

## CURD

修改`src/controllers/user.controller.ts`，新建`src/services/user.service.ts`

::: code-group

```ts [user.controller.ts]
import { Context } from 'koa'
import UserService from '../services/user.service' // [!code ++]

class UserController {
  // ...
  async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: await UserService.getUser(), // [!code hl]
    }
  }
}
```

```ts [user.service.ts]
import { Context } from 'koa'
import DBSource from '../config/db'

const singletonEnforcer = Symbol('UserService')

class UserService {
  private static _instance: UserService
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
  }
  static get instance() {
    this._instance || (this._instance = new UserService(singletonEnforcer))
    return this._instance
  }
  async getUser(ctx?: Context) {
    const userRepository = DBSource.getRepository('user')
    const users = await userRepository.find()
    return users
  }
}
export default UserService.instance
```

:::

## 路由调整

新建`src/routes/v1/index.ts`，修改`src/routes/index.ts`和`src/app.ts`

::: code-group

```ts [v1/index.ts]
import Router from 'koa-router'
import UserController from '~/controllers/user.controller'

const router = new Router()
router.prefix('/api/v1')
router.get('/user', UserController.getUser)

export default router
```

```ts [routes/index.ts]
export { default as V1Router } from './v1'
```

```ts [app.ts]
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { V1Router } from './routes' // [!code hl]
const app = new Koa()
app.use(bodyParser())

app.use(V1Router.routes()).use(V1Router.allowedMethods()) // [!code hl]
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app
```

:::
