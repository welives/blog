先前我们已经创建好了一个[基础的`Koa`工程](./搭建项目.md)，接下来我们来给它加上数据库功能

本例子将使用`Prisma`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件`.env`

## 安装`Prisma`

安装相关依赖

```sh
npm i -D prisma
npm i @prisma/client
```

## 数据库配置

初始化`Prisma`，执行`npx prisma init`，然后项目根目录会自动生成`prisma/schema.prisma`文件，根据项目情况对其进行修改

```ini{7-8}
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("MYSQL_URL")
  relationMode = "prisma"
}
```

::: tip 提示
`MYSQL_URL`是`.env`文件中的数据库环境变量

`relationMode`的作用是定义表的外键关系模式，这里用的是`prisma`模式，即虚拟外键
:::

新建数据库配置`src/config/db.ts`

```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['info', 'warn', 'error']
})

export default prisma
```

## 定义模型

如果数据表之前已经建好，那么执行`npx prisma db pull`会自动根据表生成模型并增量更新`prisma/schema.prisma`文件

如果没有数据表，那么需要手动定义模型，这里以`user`表为例

编辑`prisma/schema.prisma`文件，增加如下内容，然后执行`npx prisma db push`会根据模型信息自动创建表

```ini
model user {
  id       Int    @id @default(autoincrement())
  name     String @db.VarChar(255)
  password String @db.VarChar(255)
  email    String @db.VarChar(255)
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
import prisma from '~/config/db'

export default class UserService {
  public static async getUser(ctx?: Context) {
    const users = await prisma.user.findMany()
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

```ts{8-16}
import 'dotenv/config'
import prisma from './config/db' // [!code ++]
import app from './app'
const PORT = process.env.APP_PORT || 3000

app.listen(PORT, () => {
  console.info('Server listening on port: ' + PORT)
  prisma
    .$connect()
    .then(() => {
      console.log('数据连接成功')
    })
    .catch((err) => {
      console.error('数据连接失败')
      process.exit(1)
    })
})
```

## 目录结构

```
.
├─ prisma
│  └─ schema.prisma             # 模型层
├─ src
│  ├─ config                    # 配置文件目录
│  │  └─ db.ts
│  ├─ core                      # 业务核心目录
│  │  ├─ controllers            # 控制器层
│  │  │  └─ user.controller.ts
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
