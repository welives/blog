---
title: Koa使用Prisma
head:
  - - meta
    - name: description
      content: Koa使用Prisma
  - - meta
    - name: keywords
      content: koa koa2 mysql prisma typescript swagger session redis cron jwt 参数校验 日志 异常处理 pnpm
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Prisma`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## Prisma

```sh
pnpm add -D prisma dotenv-cli
```

### 数据库配置

![](../assets/koa/prisma_database_url.png)

参照图示，在`.env`文件中写入数据库的连接信息，例如

```ini
DATABASE_URL=mysql://root:root@localhost:3306/test
```

::: tip 提示
prisma 默认使用的是`DATABASE_URL`这个环境变量名，当然你也可以设置为其他变量名
:::

### 初始化

在`.env`文件中配置好数据库的环境变量后执行`npx prisma init`，然后项目根目录会自动生成`prisma/schema.prisma`文件，根据项目情况对其进行修改

```ini
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

::: tip 提示
`relationMode`的作用是定义表的外键关系模式，这里用的是`prisma`模式，即虚拟外键
:::

修改`tsconfig.json`，把`prisma`文件夹加入排除项

```json
{
  // ...
  "exclude": ["node_modules", "dist", "public", "prisma"] // [!code hl]
}
```

## 定义模型

如果是接入已经有表的数据库，那么直接执行`npx prisma db pull`会自动根据表生成模型并增量更新`prisma/schema.prisma`文件

::: warning 注意
由于`Prisma`默认只读取`.env`文件中的环境变量，如果有多份环境变量配置的话，需要手动指定`env`文件，例如`npx dotenv -e .env.local -- npx prisma db pull`
:::

如果数据库中还没有表，那么需要手动定义模型，这里以`user`表为例

编辑`prisma/schema.prisma`文件，增加如下内容，然后执行`npx prisma db push`会根据模型信息自动创建表

```ini
model user {
  id         Int      @id @default(autoincrement()) @db.UnsignedInt
  username   String   @db.VarChar(255)
  password   String   @db.VarChar(255)
  email      String   @unique @db.VarChar(255)
  lock_token String?  @db.VarChar(255)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now())
}
```

模型定义好之后执行如下命令生成模型实体

```sh
npx prisma generate
```

## 连接数据库

新建`src/services/prisma.serv.ts`，用来创建数据库服务

```ts
import { PrismaClient } from '@prisma/client'
const singletonEnforcer = Symbol('PrismaService')

class PrismaService {
  private _prisma: PrismaClient
  private static _instance: PrismaService
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
    this.init()
  }
  static get instance() {
    return this._instance || (this._instance = new PrismaService(singletonEnforcer))
  }
  private init() {
    this._prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['info', 'warn', 'error'],
    })
    this._prisma
      .$connect()
      .then(() => {
        console.log('数据连接成功')
      })
      .catch((err) => {
        console.error('数据连接失败')
        process.exit(1)
      })
  }
  get prisma() {
    return this._prisma
  }
}
export const prisma = PrismaService.instance.prisma
```

## CURD

编辑`src/dto/auth.ts`，补充注册接口的验证规则

```ts [auth.ts]
import { Length, IsNotEmpty, IsString, IsEmail } from 'class-validator'
// ...
export class SignUpDto {
  @Length(4, 20, { message: '用户名长度为4-20' })
  @IsString({ message: '用户名必须为字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @IsString({ message: '密码必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsString({ message: '邮箱必须为字符串' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
}
```

编辑`src/controllers/auth.ctrl.ts`，把之前的模拟数据删掉，改成操作数据库和Redis

```ts
import { request, summary, body, middlewares, tagsAll } from 'koa-swagger-decorator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { genToken, Redis, Success, Failed, HttpException } from '../utils'
import { ValidateContext, validator } from '../middlewares'
import { SignUpDto, SignInDto, TokenDto } from '../dto'
import { prisma } from '../services/prisma.serv'

@tagsAll(['Auth'])
export default class AuthController {
  @request('post', '/signup')
  @summary('注册接口')
  @middlewares([validator(SignUpDto)])
  @body({
    username: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123456' },
    email: { type: 'string', required: true, example: 'admin@example.com' },
  })
  async signUp(ctx: ValidateContext) {
    // 1.检查邮箱是否已存在
    if (await prisma.user.findUnique({ where: { email: ctx.dto.email } })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const data = {
        ...ctx.dto,
        password: await bcrypt.hash(ctx.dto.password, bcrypt.genSaltSync()),
      }
      const user = await prisma.user.create({ data })
      const { password, lock_token, ...rest } = user
      const accessToken = genToken(rest)
      const refreshToken = genToken(rest, 'REFRESH', '1d')
      // 2.将token保存到redis中
      await Redis.set(`${rest.id}:token`, JSON.stringify([refreshToken]), 24 * 60 * 60)
      throw new Success({
        status: 201,
        msg: '注册成功',
        data: { user: rest, accessToken, refreshToken },
      })
    }
  }

  @request('post', '/signin')
  @summary('登录接口')
  @middlewares([validator(SignInDto)])
  @body({
    username: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123456' },
  })
  async signIn(ctx: ValidateContext) {
    const user = await prisma.user.findFirst({ where: { username: ctx.dto.username } })
    // 1.检查用户是否存在
    if (!user) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!bcrypt.compareSync(ctx.dto.password, user.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const { password, lock_token, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens = JSON.parse(await Redis.get(`${rest.id}:token`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await Redis.set(`${rest.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @request('put', '/token')
  @summary('刷新token')
  @middlewares([validator(TokenDto)])
  @body({
    token: { type: 'string', required: true, example: 'asdasd' },
  })
  async token(ctx: ValidateContext) {
    // 1.先检查前端是否有提交token
    if (!ctx.dto.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(ctx.dto.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user.id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(ctx.dto.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 6.将新token保存到redis中
    refreshTokens = refreshTokens.filter((token) => token !== ctx.dto.token).concat([refreshToken])
    await Redis.set(`${rest.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @request('delete', '/logout')
  @summary('退出')
  @middlewares([validator(TokenDto)])
  @body({
    token: { type: 'string', required: true, example: 'asdasd' },
  })
  async logout(ctx: ValidateContext) {
    // 1.先检查前端是否有提交token
    if (!ctx.dto.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(ctx.dto.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user.id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(ctx.dto.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== ctx.dto.token)
    await Redis.set(`${user.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
export const authController = new AuthController()
```
