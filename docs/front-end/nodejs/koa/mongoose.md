---
title: Koa使用Mongoose
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Mongoose`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## 连接数据库

```sh
pnpm add mongoose
```

编辑`src/index.ts`

```ts
import './env'
import 'reflect-metadata'
import app from './app'
import mongoose from 'mongoose'
import { logger } from './utils/logger'
const url = process.env.MONGODB_URL as string

mongoose
  .connect(url)
  .then(() => {
    console.log('数据库连接成功')
    const PORT = process.env.APP_PORT || 3000
    app.listen(PORT, () => {
      logger.info(`
      ------------
      Server Started!
      App is running in ${app.env} mode
      Logging initialized at ${process.env.LOG_LEVEL} level

      Http: http://localhost:${PORT}

      API Docs: http://localhost:${PORT}/api/swagger-html
      API Spec: http://localhost:${PORT}/api/swagger-json
      ------------
      `)
    })
  })
  .catch((err) => {
    console.error('数据库连接失败', err)
  })
```

## 定义模型

新建模型`src/schemas/user.schema.ts`

```ts
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
)
// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
const userModel = mongoose.model('User', userSchema, 'users') // [!code hl]
export default userModel
```

## CURD

修改`src/controllers/user.controller.ts`，新建`src/services/user.service.ts`

::: code-group

```ts [user.controller.ts]
import { Context } from 'koa'
import UserService from '../services/user.service' // [!code ++]

export default class UserController {
  public static async getUser(ctx: Context) {
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
import userModel from '../schemas/user.schema'

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
    const users = await userModel.find({})
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
import { V1Router } from './core/routes' // [!code hl]
const app = new Koa()
app.use(bodyParser())

app.use(V1Router.routes()).use(V1Router.allowedMethods()) // [!code hl]
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app
```

:::
