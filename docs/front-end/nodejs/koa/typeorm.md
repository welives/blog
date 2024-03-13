---
title: Koa使用Typeorm
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Typeorm`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## `Typeorm`

如果用 `MySQL` 的话

```sh
pnpm add typeorm mysql2
```

如果用 `MongoDB` 的话

```sh
pnpm add typeorm mongodb
```

### 数据库配置

新建`src/utils/db.ts`

::: code-group

```ts [mysql]
import { DataSource, DataSourceOptions } from 'typeorm'

const MYSQL_URL = process.env.MYSQL_URL

const config: DataSourceOptions = {
  ...(MYSQL_URL
    ? { url: MYSQL_URL }
    : {
        host: process.env.MYSQL_HOST ?? 'localhost',
        port: Number(process.env.MYSQL_PORT ?? 3306),
        username: process.env.MYSQL_USER ?? 'root',
        password: process.env.MYSQL_PASSWORD ?? 'root',
        database: process.env.MYSQL_DBNAME ?? 'test',
      }),
  type: 'mysql',
  timezone: process.env.TIMEZONE ?? 'Asia/Shanghai',
  charset: process.env.CHARSET ?? 'utf8',
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities:
    process.env.NODE_ENV === 'development'
      ? ['src/entities/**/*.entity.ts']
      : ['dist/entities/**/*.entity.js'],
}

export const DBSource = new DataSource(config)
```

```ts [mongodb]
import { DataSource, DataSourceOptions } from 'typeorm'

const MONGODB_URL = process.env.MONGODB_URL

const config: DataSourceOptions = {
  ...(MONGODB_URL
    ? { url: MONGODB_URL }
    : {
        host: process.env.MONGODB_HOST ?? 'localhost',
        port: Number(process.env.MONGODB_PORT ?? 27017),
        username: process.env.MONGODB_USER ?? 'root',
        password: process.env.MONGODB_PWD ?? 'root',
        database: process.env.MONGODB_DBNAME ?? 'test',
      }),
  type: 'mongodb',
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities:
    process.env.NODE_ENV === 'development'
      ? ['src/entities/**/*.entity.ts']
      : ['dist/entities/**/*.entity.js'],
}

export const DBSource = new DataSource(config)
```

```ts [utils/index]
export * from './db' // [!code ++]
```

:::

### 连接数据库

编辑入口文件`src/index.ts`

```ts
import './env'
import 'reflect-metadata'
import app from './app'
import { logger, DBSource } from './utils' // [!code hl]
DBSource.initialize()
  .then(() => {
    console.log('数据库连接成功')
    const PORT = process.env.APP_PORT ?? 3000
    app.listen(PORT, () => {
      logger.info(`
      ------------
      Server Started!
      App is running in ${app.env} mode
      Logging initialized at ${process.env.LOG_LEVEL ?? 'debug'} level

      Http: http://localhost:${PORT}

      API Docs: http://localhost:${PORT}/api/swagger-html
      API Spec: http://localhost:${PORT}/api/swagger-json
      ------------
      `)
    })
  })
  .catch((err) => {
    console.error('数据库连接失败', err)
    process.exit(1)
  })
```

## 定义模型

新建模型`src/entities/user.entity.ts`

::: code-group

```ts [mysql]
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number
  @Column({ type: 'varchar', comment: '用户名' })
  username: string
  @Column({ type: 'varchar', comment: '密码' })
  password: string
  @Column({ type: 'varchar', unique: true, comment: '邮箱' })
  email: string
  @Column({ type: 'varchar', comment: '锁定的token', default: null })
  lock_token?: string
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt?: Date

  // 密码加密
  hashPassword(password: string) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync())
  }
  // 密码比对
  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}
```

```ts [mongodb]
import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity({ name: 'user' })
export class User {
  @ObjectIdColumn()
  _id: ObjectId
  @Column({ type: 'string', comment: '用户名' })
  username: string
  @Column({ type: 'string', comment: '密码' })
  password: string
  @Column({ type: 'string', unique: true, comment: '邮箱' })
  email: string
  @Column({ type: 'string', comment: '锁定的token', default: null })
  lock_token?: string
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt?: Date

  // 密码加密
  hashPassword(password: string) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync())
  }
  // 密码比对
  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}
```

:::

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

::: code-group

```ts [mysql]
import { request, summary, body, middlewares, tagsAll } from 'koa-swagger-decorator'
import jwt from 'jsonwebtoken'
import { genToken, Redis, DBSource, Success, Failed, HttpException } from '../utils'
import { ValidateContext, validator } from '../middlewares'
import { SignUpDto, SignInDto, TokenDto } from '../dto'
import { User } from '../entities/user.entity'

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
    const userRepository = DBSource.getRepository(User)
    // 1.检查邮箱是否已存在
    if (await userRepository.findOne({ where: { email: ctx.dto.email } })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = userRepository.create()
      Object.assign(user, ctx.dto)
      user.hashPassword(ctx.dto.password)
      await userRepository.save(user)
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
    const userRepository = DBSource.getRepository(User)
    const user = await userRepository.findOneBy({ username: ctx.dto.username })
    // 1.检查用户是否存在
    if (!user) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!user.comparePassword(ctx.dto.password)) {
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

```ts [mongodb]
import { request, summary, body, middlewares, tagsAll } from 'koa-swagger-decorator'
import jwt from 'jsonwebtoken'
import { genToken, Redis, DBSource, Success, Failed, HttpException } from '../utils'
import { ValidateContext, validator } from '../middlewares'
import { SignUpDto, SignInDto, TokenDto } from '../dto'
import { User } from '../entities/user.entity'

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
    const userRepository = DBSource.getRepository(User)
    // 1.检查邮箱是否已存在
    if (await userRepository.findOne({ where: { email: ctx.dto.email } })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = userRepository.create()
      Object.assign(user, ctx.dto)
      user.hashPassword(ctx.dto.password)
      await userRepository.save(user)
      const { password, lock_token, ...rest } = user
      const accessToken = genToken(rest)
      const refreshToken = genToken(rest, 'REFRESH', '1d')
      // 2.将token保存到redis中
      await Redis.set(`${rest._id}:token`, JSON.stringify([refreshToken]), 24 * 60 * 60)
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
    const userRepository = DBSource.getRepository(User)
    const user = await userRepository.findOneBy({ username: ctx.dto.username })
    // 1.检查用户是否存在
    if (!user) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!user.comparePassword(ctx.dto.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const { password, lock_token, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens = JSON.parse(await Redis.get(`${rest._id}:token`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await Redis.set(`${rest._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
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
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user._id}:token`)) ?? []
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
    await Redis.set(`${rest._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
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
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user._id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(ctx.dto.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== ctx.dto.token)
    await Redis.set(`${user._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
export const authController = new AuthController()
```

:::
