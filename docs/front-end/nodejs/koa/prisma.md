---
title: Koa使用Prisma
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Prisma`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## 安装`Prisma`

```sh
pnpm add @prisma/client
pnpm add -D prisma dotenv-cli
```

## 数据库配置

### 初始化

初始化`Prisma`，执行`npx prisma init`，然后项目根目录会自动生成`prisma/schema.prisma`文件，根据项目情况对其进行修改

::: code-group

```ini [mysql]
generator client {
  provider = "prisma-client-js"
}
// [!code focus:6]
datasource db {
  provider     = "mysql"
  url          = env("MYSQL_URL")
  relationMode = "prisma"
}
```

```ini [mongodb]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mongodb"
  url          = env("MONGODB_URL")
  relationMode = "prisma"
}
```

:::

::: tip 提示
`MYSQL_URL`是`.env`文件中的数据库环境变量

`relationMode`的作用是定义表的外键关系模式，这里用的是`prisma`模式，即虚拟外键
:::

修改`tsconfig.json`，把`prisma`文件夹加入排除项

```json
{
  // ...
  "exclude": ["node_modules", "dist", "public", "prisma"] // [!code hl]
}
```

### 定义模型

如果数据表之前已经建好，那么执行`npx prisma db pull`会自动根据表生成模型并增量更新`prisma/schema.prisma`文件

::: warning 注意
由于`Prisma`默认只读取`.env`文件中的环境变量，如果有多份环境变量配置的话，需要手动指定`env`文件，例如`npx dotenv -e .env.local -- npx prisma db pull`
:::

如果没有数据表，那么需要手动定义模型，这里以`user`表为例

编辑`prisma/schema.prisma`文件，增加如下内容，然后执行`npx prisma db push`会根据模型信息自动创建表

::: code-group

```ini [mysql]
model user {
  id       Int    @id @default(autoincrement()) @db.UnsignedInt
  username String @db.VarChar(50)
  password String @db.VarChar(100)
  salt     String @db.VarChar(50)
  avatar   String @default("") @db.VarChar(255)
  role     Int    @default(0) @db.UnsignedTinyInt
  status   Int    @default(0) @db.UnsignedTinyInt
}
```

```ini [mongodb]
model user {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  avatar   String
  password String
  role     Int
  salt     String
  status   Int
  username String @unique(map: "username_1")
}
```

:::

生成模型实体

```sh
npx prisma generate
```

新建数据库配置`src/config/db.ts`

```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['info', 'warn', 'error'],
})

export default prisma
```

## 连接数据库

修改入口文件`src/index.ts`，初始化连接

```ts{8-16}
import './env'
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
import prisma from '../config/db'

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
    const users = await prisma.user.findMany()
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
