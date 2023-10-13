---
title: Koa使用Typeorm
---

先前我们已经创建好了一个[基础的`Koa`工程](./搭建项目.md)，接下来我们来给它加上数据库功能

本例子将使用`Typeorm`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件`.env`

## 安装`Typeorm`

安装相关依赖

```sh
npm i typeorm mysql reflect-metadata
```

## 数据库配置

安装下面两个依赖，用来实现模型的自动化导入

```sh
npm i -D require-context @types/webpack-env
```

新建数据库配置`src/config/db.ts`

```ts{2-8}
import { DataSource, DataSourceOptions } from 'typeorm'
// 自动加载所有模型
const moduleFiles = require.context('../core/models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath) => {
  const value = moduleFiles(modelPath)
  // 如果是默认导出的情况,则是 [...model, value.default]
  return [...model, Object.values(value)[0]]
}, [])
const MYSQL_URL = process.env.MYSQL_URL

const config: DataSourceOptions = {
  ...(MYSQL_URL
    ? { url: MYSQL_URL }
    : {
        host: process.env.MYSQL_HOST as string,
        port: parseInt(process.env.MYSQL_PORT as string),
        username: process.env.MYSQL_USER as string,
        password: process.env.MYSQL_PASSWORD as string,
        database: process.env.MYSQL_DBNAME as string
      }),
  type: 'mysql',
  timezone: process.env.TIMEZONE,
  charset: process.env.CHARSET,
  synchronize: true,
  logging: false,
  entities: models // [!code hl]
}

const DBSource = new DataSource(config)
export default DBSource
```

## 定义模型

新建模型`src/core/models/user.model.ts`

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
@Entity({ name: 'user' }) // [!code hl]
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  password!: string

  @Column()
  email!: string
}
```

## CURD

修改`src/core/controllers/user.controller.ts`，新建`src/core/services/user.service.ts`

::: code-group

```ts [user.controller.ts]
import { Context } from 'koa'
import UserService from '../services/user.service' // [!code ++]

export default class UserController {
  public static async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: await UserService.getUser() // [!code hl]
    }
  }
}
```

```ts [user.service.ts]
import { Context } from 'koa'
import DBSource from '~/config/db'

export default class UserService {
  public static async getUser(ctx?: Context) {
    const userRepository = DBSource.getRepository('user')
    const users = await userRepository.find()
    return users
  }
}
```

:::

## 路由调整

修改`src/routes/index.ts`，新建`src/routes/v1/index.ts`

::: code-group

```ts [routes/index.ts]
export { default as V1Router } from './v1'
```

```ts [v1/index.ts]
import Router from 'koa-router'
import UserController from '~/core/controllers/user.controller'

const router = new Router()
router.prefix('/api/v1')
router.get('/user', UserController.getUser)

export default router
```

:::

## 连接数据库

修改`src/app.ts`

```ts
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

修改入口文件`src/index.ts`，初始化连接

```ts{7-17}
import 'dotenv/config'
require('require-context/register') // [!code ++]
import 'reflect-metadata' // [!code ++]
import app from './app'
import DBSource from './config/db' // [!code ++]
const PORT = process.env.APP_PORT || 3000

DBSource.initialize()
  .then(() => {
    console.log('数据库连接成功')
    app.listen(PORT, () => {
      console.info('Server listening on port: ' + PORT)
    })
  })
  .catch((err) => {
    console.error('数据库连接失败', err)
    process.exit(1)
  })
```

## 目录结构

```
.
├─ src
│  ├─ config                    # 配置文件目录
│  │  └─ db.ts
│  ├─ core                      # 业务核心目录
│  │  ├─ controllers            # 控制器层
│  │  │  └─ user.controller.ts
│  │  ├─ models                 # 模型层
│  │  │  └─ user.model.ts
│  │  ├─ services               # 服务层
│  │  │  └─ user.service.ts
│  │  ├─ routes                 # 路由
│  │  │  ├─ v1                  # 路由版本
│  │  │  │  └─ index.ts
│  │  │  └─ index.ts
│  ├─ app.ts                    # koa 实例
│  └─ index.ts                  # 入口文件
├─ nodemon.json                 # nodemon 配置
├─ ecosystem.config.js          # PM2 配置
├─ webpack.config.js            # webpack 配置
├─ tsconfig.json
```
