---
title: Koa工程搭建
---

## 扩展完善

### swagger

```bash
pnpm add koa-swagger-decorator@next reflect-metadata
```

:::tip
注意: 带`next`标记的版本是`v2`版本，完善了`v1`版本中的参数校验功能不足的问题。返回[v1版本](./create.md#swagger)
:::

新建`src/controllers/general.ctrl.ts`，同时写入session的示例代码

```ts
import { IRouterContext } from 'koa-router'
import { routeConfig, z } from 'koa-swagger-decorator'
import redis from '../utils/redis'
export default class GeneralController {
  @routeConfig({
    method: 'get',
    path: '/',
    summary: '欢迎页',
    tags: ['General'],
    request: {
      query: z.object({
        name: z.string().nullable().optional(),
      }),
    },
  })
  async hello(ctx: IRouterContext) {
    // 提取cookies中的session id
    const sid = ctx.cookies.get(process.env.COOKIE_KEY ?? 'koa.sid')
    console.log('sid', sid)
    // session prefix 拼接sid得到key
    const session_key = `${process.env.SESSION_PREFIX ?? 'koa:sess:'}${sid}`
    console.log('session_key', session_key)
    const data = await redis.get(session_key)
    console.log('data', data)
    ctx.session.name = ctx.request.query.name
    if (ctx.session.viewCount === null || ctx.session.viewCount === undefined) {
      ctx.session.viewCount = 1
    } else {
      ctx.session.viewCount++
    }
    ctx.body = `Hello ${ctx.session.name}, you check this ${ctx.session.viewCount} times`
  }
}
export const generalController = new GeneralController()
```

新建`src/routes/unprotected.ts`，用来设置不需要鉴权的路由

```ts
import Router from 'koa-router'
import { generalController } from '../controllers/general.ctrl'

const unprotectedRouter = new Router()
unprotectedRouter.get('/', generalController.hello)

export { unprotectedRouter }
```

新建`src/routes/protected.ts`，用来设置需要鉴权的路由

```ts
import { SwaggerRouter, registry } from 'koa-swagger-decorator'

const protectedRouter = new SwaggerRouter(
  {
    spec: {
      info: {
        title: 'koa-starter',
        description: 'API Doc',
        version: '1.0.0',
      },
    },
  },
  { prefix: '/api' }
)
// 用来指定token存放的位置和key名
registry.registerComponent('securitySchemes', process.env.API_KEY ?? 'authorization', {
  type: 'apiKey',
  name: process.env.API_KEY ?? 'authorization',
  in: 'header',
})
// 开发环境才挂载swagger
if (process.env.NODE_ENV === 'development') {
  protectedRouter.swagger()
}

export { protectedRouter }
```

编辑`src/routes/index.ts`、`src/app.ts`和`src/index.ts`

::: code-group

```ts [routes/index.ts]
export * from './unprotected'
export * from './protected'
```

```ts [src/app.ts]
import { unprotectedRouter, protectedRouter } from './routes' // [!code hl]
// ...
app.use(helmet()) // [!code --]
app
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'], // [!code hl]
      },
    })
  )
  .use(cors())
  .use(bodyParser())
  .use(koaStatic(path.resolve(__dirname, '../public')))

app
  .use(catchError) // 注意一定要放在路由的前面加载
  .use(unprotectedRouter.routes()) // [!code ++]
  .use(unprotectedRouter.allowedMethods()) // [!code ++]
  .use(protectedRouter.routes()) // [!code ++]
  .use(protectedRouter.allowedMethods()) // [!code ++]
// ...
```

```ts [src/index.ts]
import './env'
import 'reflect-metadata' // [!code ++]
import app from './app'
import { logger } from './utils/logger' // [!code ++]
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
```

:::

### JWT

```bash
pnpm add jsonwebtoken bcryptjs koa-unless
pnpm add @types/jsonwebtoken @types/bcryptjs -D
```

编辑`src/utils/utils.ts`，添加生成token的方法

```ts
import jwt from 'jsonwebtoken' // [!code ++]
// ...
export function genToken(
  payload: any,
  secretType: 'ACCESS' | 'REFRESH' = 'ACCESS',
  expiresIn: string | number | null = process.env.JWT_EXPIRED ?? '30s'
) {
  const secret =
    secretType === 'ACCESS'
      ? process.env.ACCESS_TOKEN_SECRET ?? 'secret'
      : process.env.REFRESH_TOKEN_SECRET ?? 'secret'
  if (expiresIn === null || expiresIn === '') {
    return jwt.sign(payload, secret)
  }
  return jwt.sign(payload, secret, { expiresIn })
}
```

新建`src/controllers/auth.ctrl.ts`，用来写模拟的登录接口

新建`src/validators/auth.ts`，用来编写接口的参数校验规则

:::tip
因为目前还没接入数据库，所以先用模拟的数据来测试
:::

::: code-group

```ts [auth.ctrl.ts]
import { IRouterContext } from 'koa-router'
import { routeConfig, body, ParsedArgs } from 'koa-swagger-decorator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Success, HttpException } from '../utils/exception'
import { genToken } from '../utils/utils'
import redis from '../utils/redis'
import { signInReq, tokenReq, ISignInReq, ITokenReq } from '../validators'

export default class AuthController {
  // 模拟数据
  readonly username = 'admin'
  // 123456
  readonly password = '$2a$10$D46VTSW0Mpe6P96Sa1w8tebfeYfZf1s.97Dz84XFfpcUvjtSCvLMO'
  @routeConfig({
    method: 'post',
    path: '/signin',
    summary: '登录接口',
    tags: ['Auth'],
  })
  @body(signInReq)
  async signIn(ctx: IRouterContext, args: ParsedArgs<ISignInReq>) {
    // 1.检查用户是否存在
    if (args.body.username !== this.username) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!bcrypt.compareSync(args.body.password, this.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const accessToken = genToken({ username: this.username })
    const refreshToken = genToken({ username: this.username }, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens = JSON.parse(await redis.get(`${this.username}:token`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await redis.set(`${this.username}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'put',
    path: '/token',
    summary: '刷新token',
    tags: ['Auth'],
  })
  @body(tokenReq)
  async token(ctx: IRouterContext, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`${this.username}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 6.将新token保存到redis中
    refreshTokens = refreshTokens
      .filter((token) => token !== args.body.token)
      .concat([refreshToken])
    await redis.set(`${rest.username}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'delete',
    path: '/logout',
    summary: '退出',
    tags: ['Auth'],
    security: [{ [process.env.API_KEY ?? 'authorization']: [] }],
  })
  @body(tokenReq)
  async logout(ctx: IRouterContext, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`${this.username}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== args.body.token)
    // 6.更新redis
    await redis.set(`${user.username}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
export const authController = new AuthController()
```

```ts [auth.ts]
import { z } from 'koa-swagger-decorator'

const signInReq = z.object({
  username: z
    .string({ required_error: '用户名不能为空' })
    .trim()
    .min(4, '用户名长度不能少于4位')
    .max(20, '用户名长度最多20位'),
  password: z.string({ required_error: '密码不能为空' }).min(6, '密码长度不能少于6位'),
})

const tokenReq = z.object({
  token: z.string({ required_error: 'token不能为空' }).trim(),
})

export { signInReq, tokenReq }
export type ISignInReq = z.infer<typeof signInReq>
export type ITokenReq = z.infer<typeof tokenReq>
```

:::

编辑`src/routes/protected.ts`，应用`Auth`路由模块

```ts
import AuthController from '../controllers/auth.ctrl' // [!code ++]
// ...
protectedRouter.applyRoute(AuthController) // [!code ++]
```

新建`src/middlewares/auth.ts`，用于校验token

```ts
import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { HttpException } from '../utils/exception'
const unless = require('koa-unless')

export default function () {
  const verifyToken = async (ctx: Context, next: Next) => {
    const authzHeader = ctx.request.header.authorization
    const accessToken = authzHeader && authzHeader.split(' ')[1]
    if (!accessToken) {
      throw new HttpException('unauthorized')
    } else {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET ?? 'secret', (err, decode) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new HttpException('forbidden', { msg: '令牌过期' })
          } else if (err.name === 'JsonWebTokenError') {
            throw new HttpException('forbidden', { msg: '无效令牌' })
          }
        }
        ctx.state.user = decode
      })
      return next()
    }
  }
  verifyToken.unless = unless
  return verifyToken
}
```

编辑`src/app.ts`，应用`Auth`中间件

```ts
import verifyToken from './middlewares/auth' // [!code ++]
// ...
app
  .use(catchError) // 注意一定要放在路由的前面加载
  .use(unprotectedRouter.routes())
  .use(unprotectedRouter.allowedMethods())
  .use(
    verifyToken().unless({
      path: [
        /^\/public/,
        /^\/favicon.ico/,
        /^(?!\/api)/,
        /^\/api\/swagger-/,
        /^\/api\/signin/,
        /^\/api\/token/,
      ],
    })
  )
  .use(protectedRouter.routes())
  .use(protectedRouter.allowedMethods())
```

编辑`src/middlewares/error_handler.ts`，适配`swagger`插件内置的参数校验

```ts
import { BaseContext, Next } from 'koa'
import { z } from 'koa-swagger-decorator' // [!code ++]
// ...

/** @description 错误处理中间件 */
export default async (ctx: BaseContext, next: Next) => {
  try {
    await next().catch((error) => {
      if (error instanceof z.ZodError) {
        throw new HttpException('parameters', {
          msg: error.issues.map((issue) => issue.message).join(';'),
        })
      }
      throw error
    })
  } catch (error: any) {
    // ...
  }
}
```

:::tip 🎉 到这里，扩展部分就结束了，数据库的集成请看其他篇章
:::
