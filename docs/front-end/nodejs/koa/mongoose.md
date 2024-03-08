---
title: Koa使用Mongoose
---

先前我们已经创建好了一个[基础的`Koa`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Mongoose`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## Redis

```bash
pnpm add ioredis
```

新建`src/utils/redis.ts`

```ts
import IoRedis from 'ioredis'

const singletonEnforcer = Symbol('Redis')
class Redis {
  private redis: IoRedis
  private static _instance: Redis
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
    this.init()
  }
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    return this._instance || (this._instance = new Redis(singletonEnforcer))
  }

  private init() {
    this.redis = new IoRedis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      username: '',
      password: '',
      db: 0,
    })
    if (!this.redis) {
      console.error('Redis 连接失败')
      process.exit(1)
    }
    console.log('Redis 连接成功')
  }

  async set(key: string, value: string, expire: number) {
    await this.redis.set(key, value, 'EX', expire)
  }
  async get(key: string) {
    return this.redis.get(key)
  }
  async del(key: string) {
    return this.redis.del(key)
  }
}
export default Redis.instance
```

## MongoDB

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
import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'

export interface User {
  id: string
  username: string
  password: string
  email: string
  lock_token?: string
  comparePassword(password: string): boolean
}

type UserDocument = mongoose.Document & User

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
      unique: true,
      trim: true,
    },
    lock_token: {
      type: String,
      default: null,
    },
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, timestamps: { currentTime: () => Date.now() } }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})
userSchema.virtual('gmt_created').get(function () {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})
userSchema.virtual('gmt_updated').get(function () {
  return dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
})
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
const UserRepository = mongoose.model<UserDocument>('User', userSchema, 'user')
export default UserRepository
```

## CURD

### 服务模块

新建`src/services/base.serv.ts`和`src/services/auth.serv.ts`，用来操作数据模型层

::: code-group

```ts [base.serv.ts]
import type { Document, Model } from 'mongoose'

export abstract class BaseService<T> {
  abstract Repository: Model<Document & T>
  async findAll() {
    return this.Repository.find()
  }
  async findOne(query: any) {
    return this.Repository.findOne(query)
  }
  async findById(id: string) {
    return this.Repository.findById(id)
  }
  async save(data: any) {
    const doc = await this.Repository.create(data)
    return doc.toObject({ virtuals: true })
  }
  async deleteOne(id: string) {
    return this.Repository.deleteOne({ _id: id })
  }
}
```

```ts [auth.serv.ts]
import bcrypt from 'bcryptjs'
import UserRepository, { User } from '../schemas/user.schema'
import { BaseService } from './base.serv'

class UserService extends BaseService<User> {
  Repository = UserRepository
  async findByNameOrEmail(username: string, email: string) {
    return this.Repository.findOne({ $or: [{ username }, { email }] })
  }
  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }
}
export default new UserService()
```

:::

### 控制器模块

编辑`src/validators/auth.ts`，补充注册的验证规则

```ts [auth.ts]
const signUpReq = z.object({
  username: z
    .string({ required_error: '用户名不能为空' })
    .trim()
    .min(4, '用户名长度不能少于4位')
    .max(20, '用户名长度最多20位'),
  password: z.string({ required_error: '密码不能为空' }).min(6, '密码长度不能少于6位'),
  email: z.string({ required_error: '邮箱不能为空' }).trim().email('邮箱格式不正确'),
})
// ...
export { signUpReq, signInReq, tokenReq }
export type ISignUpReq = z.infer<typeof signUpReq>
```

编辑`src/controllers/auth.ctrl.ts`，把之前的模拟数据删掉，改成操作数据库和Redis

```ts
import { Context } from 'koa'
import { routeConfig, body, ParsedArgs } from 'koa-swagger-decorator'
import jwt from 'jsonwebtoken'
import { Success, HttpException, Failed } from '../utils/exception'
import { genToken } from '../utils/utils'
import redis from '../utils/redis'
import UserService from '../services/user.serv'
import { signUpReq, signInReq, tokenReq, ISignUpReq, ISignInReq, ITokenReq } from '../validators'

export default class AuthController {
  @routeConfig({
    method: 'post',
    path: '/signup',
    summary: '注册接口',
    tags: ['Auth'],
  })
  @body(signUpReq)
  async signUp(ctx: Context, args: ParsedArgs<ISignUpReq>) {
    if (await UserService.findOne({ email: args.body.email })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = await UserService.save(args.body)
      delete user.password
      const { _id, password, lock_token, ...rest } = user
      const accessToken = genToken(rest)
      const refreshToken = genToken(rest, 'REFRESH', '1d')
      // 将刷新token保存到redis中
      await redis.set(`token:${rest.id}`, JSON.stringify([refreshToken]), 24 * 60 * 60)
      throw new Success({
        status: 201,
        msg: '注册成功',
        data: { user: rest, accessToken, refreshToken },
      })
    }
  }

  @routeConfig({
    method: 'post',
    path: '/signin',
    summary: '登录接口',
    tags: ['Auth'],
  })
  @body(signInReq)
  async signIn(ctx: Context, args: ParsedArgs<ISignInReq>) {
    const doc = await UserService.findOne({ username: args.body.username })
    // 1.检查用户是否存在
    if (!doc) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!doc.comparePassword(args.body.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const user = doc.toObject({ virtuals: true })
    const { _id, password, lock_token, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens: string[] = JSON.parse(await redis.get(`token:${rest.id}`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await redis.set(`token:${rest.id}`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'put',
    path: '/token',
    summary: '刷新token',
    tags: ['Auth'],
  })
  @body(tokenReq)
  async token(ctx: Context, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`token:${user.id}`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 6.将刷新token保存到redis中
    refreshTokens = refreshTokens
      .filter((token) => token !== args.body.token)
      .concat([refreshToken])
    await redis.set(`token:${rest.id}`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'delete',
    path: '/logout',
    summary: '退出',
    tags: ['Auth'],
    security: [{ [process.env.API_KEY]: [] }],
  })
  @body(tokenReq)
  async logout(ctx: Context, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`token:${user.id}`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== args.body.token)
    // 6.更新redis
    await redis.set(`token:${user.id}`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
```
