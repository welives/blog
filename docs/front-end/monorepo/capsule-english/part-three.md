## 配置Nestjs

在`server`项目中新建`src/app`目录，把原本创建项目时自动生成的`app`模块全部移入`app`目录

```sh
mkdir src/app
mv src/app.* src/app/
```

因为默认模块的路径变了，需要在入口文件`main.ts`调整一下

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module' // [!code focus]

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
bootstrap()
```

### 移除ESLint

由于我们已经在主项目中配置了全局的`ESLint`和`Prettier`，所以子项目中就不需要了，删掉相关的文件和依赖

```sh
rm .eslintrc.js .prettierrc
pnpm rm -F server eslint eslint-config-prettier eslint-plugin-prettier prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

编辑`server`项目的`package.json`，把跟ESLint相关的脚本命令删掉

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"", // [!code --]
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix" // [!code --]
  }
}
```

## 公共模块

虽然目前的`server`项目是单体项目，但为了使其具备良好的拓展性，需要把一些通用的功能抽离成公共模块

先在主项目中安装如下两个依赖，待会新建的公共子项目会用到

```sh
pnpm add -wD rollup rollup-plugin-ts drizzle-kit
```

### 日志模块

我这次用的是`pino`，而在我[另一篇Nestjs笔记](../../nodejs/nestjs/create.md#日志)中用的日志插件是`winston`

在主项目中新建`packages/logger`文件夹并进入，接着执行`pnpm`初始化

```sh
mkdir packages/logger && cd packages/logger
pnpm init
```

编辑`package.json`，将`name`字段的值设置为`@capsule/logger`

在`@capsule/logger`项目中安装如下四个依赖，并新建`tsconfig.json`文件

:::code-group

```sh [terminal]
pnpm add -D -F @capsule/logger @nestjs/common nestjs-pino pino-http pino-pretty
touch tsconfig.json
```

```json [tsconfig.json]
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "allowJs": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "test", "./rollup.config.js"]
}
```

:::

公共子项目`@capsule/logger`只需要新建如下两个文件来实现逻辑

- `src/logger.module.ts`
- `src/index.ts`

:::code-group

```ts [logger.module]
import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule, Logger } from 'nestjs-pino'

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
```

```ts [index.ts]
export * from './logger.module'
export {
  LoggerModule as PinoLoggerModule,
  Logger,
  PinoLogger,
  InjectPinoLogger,
  getLoggerToken,
  LoggerErrorInterceptor,
  PARAMS_PROVIDER_TOKEN,
} from 'nestjs-pino'
export type { Params, LoggerModuleAsyncParams } from 'nestjs-pino'
```

:::

接着在`@capsule/logger`子项目下新建`rollup.config.js`文件用来配置打包，同时再次编辑`package.json`添加打包指令和包导出声明

:::code-group

```js [rollup.config.js]
import ts from 'rollup-plugin-ts'
export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.js',
      format: 'es',
    },
  ],
  plugins: [ts()],
  watch: { exclude: 'node_modules/**' },
}
```

```json{5-17} [package.json]
{
  "name": "@capsule/logger",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "rollup -c -m"
  }
  // ...
}
```

:::

最后是在`server`项目引入此`@capsule/logger`子项目作为依赖，并在`app`模块中注册此`logger`模块

:::code-group

```ts [main.ts]
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { Logger } from '@capsule/logger' // [!code ++]
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // [!code ++]
  })
  app.useLogger(app.get(Logger)) // [!code ++]
  await app.listen(4000)
}
bootstrap()
```

```ts [app.module.ts]
import { Module } from '@nestjs/common'
import { LoggerModule } from '@capsule/logger' // [!code ++]

@Module({
  imports: [LoggerModule], // [!code ++]
})
export class AppModule {}
```

```json [package.json]
{
  "name": "server",
  // ...
  "dependencies": {
    "@capsule/logger": "workspace:^" // [!code ++]
    // ...
  }
}
```

:::

### 配置管理模块

`config`子项目的初始配置和`logger`子项目类似

```sh
mkdir packages/config && cd packages/config
pnpm init
```

编辑`package.json`，将`name`字段的值设置为`@capsule/config`

安装依赖

:::code-group

```sh [terminal]
pnpm add -D -F @capsule/config @nestjs/common @nestjs/microservices joi
touch tsconfig.json
```

```json [tsconfig.json]
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "allowJs": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "test", "./rollup.config.js"]
}
```

:::

公共子项目`@capsule/config`需要新建如下几个文件来实现具体逻辑

- `src/config.module.ts`
- `src/config.service.ts`
- `src/config.interface.ts`
- `src/config.constants.ts`
- `src/env.ts`
- `src/index.ts`

:::code-group

```ts [config.module]
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { ConfigModuleOptions } from './config.interface'
import { CONFIG_OPTIONS } from './config.constants'

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static register(options: ConfigModuleOptions, isGlobal = true): DynamicModule {
    return {
      global: isGlobal,
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    }
  }
}
```

```ts [config.service]
import { Inject, Injectable } from '@nestjs/common'
import Joi from 'joi'
import { DEFAULT_CONFIG, CONFIG_OPTIONS, DEFAULT_ALLOWED_ENVS } from './config.constants'
import type { IConfig, ConfigOptions } from './config.interface'
import { loadEnv } from './env'

@Injectable()
export class ConfigService {
  private config: IConfig
  private defConfig: IConfig
  private allowedEnvs: string[]
  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    this.allowedEnvs = options.allowed_envs || DEFAULT_ALLOWED_ENVS
    this.defConfig = options.config || DEFAULT_CONFIG
    this.loadConfig(options.path)
  }

  public get<K extends keyof IConfig>(key: K): Readonly<IConfig[K]> {
    return this.config[key]
  }

  private loadConfig(path: string) {
    this.config = this.parseConfigFromEnv(path)
  }

  private parseConfigFromEnv(path: string): IConfig {
    const config = loadEnv(process.env.NODE_ENV, path)
    const allowedConfig = {}
    for (const [key, value] of Object.entries(config)) {
      if (this.allowedEnvs.includes(key) && Object.prototype.hasOwnProperty.call(config, key)) {
        // @ts-expect-error allow
        allowedConfig[key] = value
      }
    }

    const schema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'test', 'production').default(this.defConfig.env),
      NEST_HOST: Joi.string().allow('').default('127.0.0.1'),
      NEST_PORT: Joi.number().default(this.defConfig.port),
      JWT_ACCESS_SECRET: Joi.string().required(),
      JWT_REFRESH_SECRET: Joi.string().required(),
      JWT_ACCESS_EXPIRY: Joi.string().default(this.defConfig.jwt.access_expires_in),
      JWT_REFRESH_EXPIRY: Joi.string().default(this.defConfig.jwt.refresh_expires_in),
      REDIS_URL: Joi.string().default(this.defConfig.redis.url),
      REDIS_HOST: Joi.string().allow('').default('127.0.0.1'),
      REDIS_PORT: Joi.number().allow('').default(6379),
      REDIS_USER: Joi.string().allow(''),
      REDIS_PWD: Joi.string().allow(''),
      DATABASE_DSN: Joi.string().default(this.defConfig.database.url),
      DATABASE_HOST: Joi.string().allow(''),
      DATABASE_PORT: Joi.string().allow('').default(5432),
      DATABASE_USER: Joi.string().allow(''),
      DATABASE_PWD: Joi.string().allow(''),
      DATABASE_DBNAME: Joi.string().allow(''),
    })
    const { error, value } = schema.validate(allowedConfig)

    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
    return {
      host: value.NEST_HOST || this.defConfig.host,
      port: value.NEST_PORT,
      env: value.NODE_ENV,
      database: {
        url: value.DATABASE_DSN,
        host: value.DATABASE_HOST || this.defConfig.database.host,
        port: value.DATABASE_PORT || this.defConfig.database.port,
        user: value.DATABASE_USER || this.defConfig.database.user,
        pwd: value.DATABASE_PWD || this.defConfig.database.pwd,
        db: value.DATABASE_DBNAME || this.defConfig.database.db,
      },
      redis: {
        url: value.REDIS_URL,
        host: value.REDIS_HOST || this.defConfig.redis.host,
        port: value.REDIS_PORT || this.defConfig.redis.port,
        user: value.REDIS_USER || this.defConfig.redis.user,
        pwd: value.REDIS_PWD || this.defConfig.redis.pwd,
      },
      jwt: {
        access_secret: value.JWT_ACCESS_SECRET || this.defConfig.jwt.access_secret,
        refresh_secret: value.JWT_REFRESH_SECRET || this.defConfig.jwt.refresh_secret,
        access_expires_in: value.JWT_ACCESS_EXPIRY,
        refresh_expires_in: value.JWT_REFRESH_EXPIRY,
      },
    }
  }
}
```

```ts [config.interface]
import { MicroserviceOptions } from '@nestjs/microservices'

export interface ConfigOptions {
  path: string
  config?: IConfig
  allowed_envs?: string[]
}

export interface ConfigModuleOptions extends ConfigOptions {}

export interface IConfigDatabase {
  url: string
  host?: string
  port?: number
  user?: string
  pwd?: string
  db?: string
}

export interface IConfigRedis {
  url: string
  host?: string
  port?: number
  user?: string
  pwd?: string
}

export interface IConfigJWT {
  access_secret: string
  refresh_secret: string
  access_expires_in: string | number
  refresh_expires_in: string | number
}

export interface IConfig {
  host?: string
  env: string
  port: number
  database: IConfigDatabase
  redis: IConfigRedis
  jwt: IConfigJWT
  auth_micro_service?: MicroserviceOptions
}
```

```ts [config.constants]
import { IConfig } from './config.interface'

export const CONFIG_OPTIONS = Symbol()

export const DEFAULT_CONFIG: IConfig = {
  port: 4000,
  env: 'development',
  database: {
    url: 'postgres://postgres:password@postgres:5432/capsule',
  },
  redis: {
    url: 'redis://127.0.0.1:6379',
  },
  jwt: {
    access_secret: '',
    refresh_secret: '15m',
    access_expires_in: '',
    refresh_expires_in: '7d',
  },
}

export const DEFAULT_ALLOWED_ENVS: string[] = [
  'NODE_ENV',
  'NEST_HOST',
  'NEST_PORT',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRY',
  'JWT_REFRESH_EXPIRY',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_USER',
  'REDIS_PWD',
  'DATABASE_DSN',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PWD',
  'DATABASE_DBNAME',
]
```

```ts [env.ts]
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

/**
 * 尝试读取文件
 * @param file 文件路径
 * @returns
 */
export function tryStatSync(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {}
}

/**
 * 根据运行环境不同拿到对应的文件列表
 * @param mode 环境变量模式
 * @returns
 */
export function getEnvFiles(mode: string) {
  return mode === 'production'
    ? ['.env.production']
    : [/** default file */ `.env`, /** mode file */ `.env.${mode}`]
}

/**
 * 读取环境变量
 * @param mode 环境变量模式
 * @param dir 相对主项目根目录的路径
 * @returns
 */
export function loadEnv(mode: string, dir: string) {
  const envFiles = getEnvFiles(mode)
  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      const filePath = path.resolve(process.cwd(), dir, file)
      if (!tryStatSync(filePath)?.isFile()) return []
      return Object.entries(dotenv.parse(fs.readFileSync(filePath)))
    })
  )
  return parsed
}
```

```ts [index.ts]
export * from './config.interface'
export { ConfigModule } from './config.module'
export { ConfigService } from './config.service'
export { CONFIG_OPTIONS } from './config.constants'
```

:::

:::tip ⚡提示
我没有使用官方的`@nestjs/config`模块，而是自定义了一个简易的`config`模块，采用的实现方式是动态模块，相关文档可以参考[动态模块](https://docs.nestjs.cn/10/fundamentals?id=%e5%8a%a8%e6%80%81%e6%a8%a1%e5%9d%97)
:::

打包的配置参考上面的`@capsule/logger`子项目

最后是在`server`项目引入此`@capsule/config`子项目作为依赖，并在`app`模块中注册此`config`模块

:::code-group

```ts [app.module.ts]
import { Module } from '@nestjs/common'
import { ConfigModule } from '@capsule/config' // [!code ++]

@Module({
  imports: [ConfigModule.register({ path: '../../' })], // [!code ++]
})
export class AppModule {}
```

```json [package.json]
{
  "name": "server",
  // ...
  "dependencies": {
    "@capsule/config": "workspace:^" // [!code ++]
    // ...
  }
}
```

:::

### 数据模型模块

经过上面两个`@capsule/logger`和`@capsule/config`子项目的操作，之后再创建新建的子项目模块肯定轻车熟路了，这次来创建一个`schema`子项目，用来管理数据表的模型

```sh
mkdir packages/schema && cd packages/schema
pnpm init
```

编辑`package.json`，将`name`字段的值设置为`@capsule/schema`

安装依赖

```sh
pnpm add -F @capsule/schema @paralleldrive/cuid2 drizzle-orm dayjs
```

新建如下几个文件来实现具体逻辑，前期业务很简单，这几个表就行

- `src/schemas/course.ts`
- `src/schemas/coursePack.ts`
- `src/schemas/courseHistory.ts`
- `src/schemas/statement.ts`
- `src/schemas/membership.ts`
- `src/schemas/userCourseProgress.ts`
- `src/schemas/userLearnRecord.ts`
- `src/index.ts`

:::code-group

```ts [course]
import { integer, pgTable, bigint, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'
import { coursePack } from './coursePack'
import { statement } from './statement'

// 课程表
export const course = pgTable('courses', {
  // $defaultFn 可以通过一个回调来实现字段值的自定义生成方式
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').default(''),
  video: text('video').default(''),
  order: integer('order').notNull(),
  coursePackId: text('course_pack_id')
    .notNull()
    .references(() => coursePack.id),
  createdAt: bigint('created_at', { mode: 'number' })
    .notNull()
    .$default(() => +new Date()),
  createdAtView: timestamp('created_at_view', { mode: 'string' })
    .notNull()
    .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
  updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  ),
})

export const courseRelations = relations(course, ({ one, many }) => ({
  // 一对多, 一个课程含有多个展示内容
  statements: many(statement),
  // 一对一, 一个课程属于一个课程包
  coursePack: one(coursePack, { fields: [course.coursePackId], references: [coursePack.id] }),
}))
```

```ts [coursePack]
import { boolean, integer, pgTable, text, timestamp, bigint } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'
import { course } from './course'

// 课程包
export const coursePack = pgTable('course_packs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  order: integer('order').notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  isFree: boolean('is_free').default(false),
  cover: text('cover'),
  createdAt: bigint('created_at', { mode: 'number' })
    .notNull()
    .$default(() => +new Date()),
  createdAtView: timestamp('created_at_view', { mode: 'string' })
    .notNull()
    .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
  updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  ),
})

// 一对多, 一个课程包含有多个课程
export const coursePackRelations = relations(coursePack, ({ many }) => ({ courses: many(course) }))
```

```ts [courseHistory]
import { integer, pgTable, text, timestamp, unique, bigint } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'

// 课程学习历史
export const courseHistory = pgTable(
  'course_histories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').notNull(),
    courseId: text('course_id').notNull(),
    coursePackId: text('course_pack_id').notNull(),
    completionCount: integer('completion_count').notNull(),
    createdAt: bigint('created_at', { mode: 'number' })
      .notNull()
      .$default(() => +new Date()),
    createdAtView: timestamp('created_at_view', { mode: 'string' })
      .notNull()
      .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
    updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
    updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
      dayjs().format('YYYY-MM-DD HH:mm:ss')
    ),
  },
  (table) => ({
    // 组合索引
    unq: unique().on(table.userId, table.courseId, table.coursePackId),
  })
)
```

```ts [statement]
import { integer, pgTable, text, timestamp, bigint } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'
import { course } from './course'

// 课程具体内容
export const statement = pgTable('statements', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  order: integer('order').notNull(),
  chinese: text('chinese').notNull(),
  english: text('english').notNull(),
  soundmark: text('soundmark').notNull(),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id),
  createdAt: bigint('created_at', { mode: 'number' })
    .notNull()
    .$default(() => +new Date()),
  createdAtView: timestamp('created_at_view', { mode: 'string' })
    .notNull()
    .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
  updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  ),
})

export const statementRelations = relations(statement, ({ one }) => ({
  // 一对一, 一个展示内容属于一个课程
  courses: one(course, {
    fields: [statement.courseId],
    references: [course.id],
  }),
}))
```

```ts [membership]
import { boolean, integer, pgTable, text, timestamp, bigint } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'

// 会员表
export const membership = pgTable('memberships', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id').notNull(),
  start_date: integer('start_date').notNull(),
  end_date: integer('end_date').notNull(),
  isActive: boolean('is_active'),
  createdAt: bigint('created_at', { mode: 'number' })
    .notNull()
    .$default(() => +new Date()),
  createdAtView: timestamp('created_at_view', { mode: 'string' })
    .notNull()
    .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
  updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  ),
})
```

```ts [userCourseProgress]
import { integer, pgTable, text, timestamp, unique, bigint } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'

// 用户学习进度表
export const userCourseProgress = pgTable(
  'user_course_progress',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').notNull(),
    courseId: text('course_id').notNull(),
    coursePackId: text('course_pack_id').notNull(),
    statementIndex: integer('statement_index').notNull(),
    createdAt: bigint('created_at', { mode: 'number' })
      .notNull()
      .$default(() => +new Date()),
    createdAtView: timestamp('created_at_view', { mode: 'string' })
      .notNull()
      .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
    updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
    updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
      dayjs().format('YYYY-MM-DD HH:mm:ss')
    ),
  },
  (t) => ({
    unq: unique().on(t.userId, t.coursePackId),
  })
)
```

```ts [userLearnRecord]
import { date, integer, pgTable, text, timestamp, unique, bigint } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import dayjs from 'dayjs'

// 用户学习记录
export const userLearnRecord = pgTable(
  'user_learn_records',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id').notNull(),
    count: integer('count').notNull().default(0),
    day: date('day').notNull(),
    createdAt: bigint('created_at', { mode: 'number' })
      .notNull()
      .$default(() => +new Date()),
    createdAtView: timestamp('created_at_view', { mode: 'string' })
      .notNull()
      .$defaultFn(() => dayjs().format('YYYY-MM-DD HH:mm:ss')),
    updatedAt: bigint('updated_at', { mode: 'number' }).$onUpdateFn(() => +new Date()),
    updatedAtView: timestamp('updated_at_view', { mode: 'string' }).$onUpdateFn(() =>
      dayjs().format('YYYY-MM-DD HH:mm:ss')
    ),
  },
  (t) => ({
    unq: unique().on(t.userId, t.day),
  })
)
```

```ts [index.ts]
import { course, courseRelations } from './schemas/course'
import { courseHistory } from './schemas/courseHistory'
import { coursePack, coursePackRelations } from './schemas/coursePack'
import { membership } from './schemas/membership'
import { statement, statementRelations } from './schemas/statement'
import { userCourseProgress } from './schemas/userCourseProgress'
import { userLearnRecord } from './schemas/userLearnRecord'

export * from './schemas/course'
export * from './schemas/courseHistory'
export * from './schemas/coursePack'
export * from './schemas/membership'
export * from './schemas/statement'
export * from './schemas/userCourseProgress'
export * from './schemas/userLearnRecord'

export const schemas = {
  course,
  statement,
  statementRelations,
  membership,
  userCourseProgress,
  userLearnRecord,
  coursePack,
  courseRelations,
  coursePackRelations,
  courseHistory,
}

export type SchemaType = typeof schemas
```

:::

打包的配置参考上面的`@capsule/logger`子项目，不要忘了在`server`项目中引入此子项目作为依赖

### 数据库模块

`database`子项目的剥离过程虽然和上面几个子项目类似，但因为要兼顾在`server`项目之外写一些脚本，需要做一点额外的调整

```sh
mkdir packages/database && cd packages/database
pnpm init
```

编辑`package.json`，将`name`字段的值设置为`@capsule/database`

安装如下三个依赖，并新建`tsconfig.json`文件

:::code-group

```sh [terminal]
pnpm add -F @capsule/database @nestjs/common drizzle-orm pg
# 这个类型库安装到主项目
pnpm add -wD @types/pg inquirer shelljs @types/inquirer @types/shelljs
```

```json [tsconfig.json]
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "allowJs": false
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "./rollup.config.js",
    "./drizzle.config.ts",
    "scripts/**/*.ts",
    "drizzle"
  ]
}
```

:::

新建如下几个文件来处理`server`项目所需的数据库服务

- `src/postgres/postgres.module.ts`
- `src/postgres/postgres.service.ts`
- `src/common/database.constants.ts`
- `src/common/database.interface.ts`
- `src/common/database.definition.ts`
- `src/index.ts`

:::code-group

```ts [postgres.module]
import { DynamicModule, Module } from '@nestjs/common'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} from '../common/database.definition'
import { PostgresService } from './postgres.service'
import { DATABASE_OPTIONS } from '../common/database.constants'

@Module({
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE, isGlobal = true): DynamicModule {
    const { providers = [], exports = [], global, ...props } = super.register(options)
    return {
      ...props,
      global: isGlobal,
      providers: [
        ...providers,
        {
          provide: DATABASE_OPTIONS,
          useFactory: (db: PostgresService) => {
            return db.client
          },
          inject: [PostgresService],
        },
      ],
      exports: [...exports],
    }
  }
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE, isGlobal = true): DynamicModule {
    const { providers = [], exports = [], global, ...props } = super.registerAsync(options)
    return {
      ...props,
      global: isGlobal,
      providers: [
        ...providers,
        {
          provide: DATABASE_OPTIONS,
          useFactory: (db: PostgresService) => {
            return db.client
          },
          inject: [PostgresService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports],
    }
  }
}
```

```ts [postgres.service]
import { Inject, Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { SchemaType } from '@capsule/schema'
import type { DrizzlePgConfig } from '../common/database.interface'
import { MODULE_OPTIONS_TOKEN } from '../common/database.definition'

@Injectable()
export class PostgresService implements OnModuleInit {
  private _client: pg.Client | pg.Pool
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: DrizzlePgConfig) {
    if (this.options.clientType === 'client') {
      this._client = new pg.Client(this.options.clientConfig)
    } else {
      this._client = new pg.Pool(this.options.clientConfig)
    }
  }

  async onModuleInit(): Promise<void> {
    await this._client.connect()
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    await this._client.end()
    await app.close()
  }

  get client() {
    return drizzle(this._client, this.options.drizzleConfig) as NodePgDatabase<SchemaType>
  }
}
```

```ts [database.constants]
export const DATABASE_OPTIONS = Symbol()
```

```ts [database.interface]
import { DrizzleConfig } from 'drizzle-orm'
import { ClientConfig, PoolConfig } from 'pg'

export interface DrizzlePgConfig<T = any> {
  clientType: 'client' | 'pool'
  clientConfig: ClientConfig | PoolConfig
  drizzleConfig?: DrizzleConfig<Record<string, T>> | undefined
}
```

```ts [database.definition]
import { ConfigurableModuleBuilder } from '@nestjs/common'
import { DrizzlePgConfig } from './database.interface'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DrizzlePgConfig>().build()
```

```ts [index.ts]
export { PostgresModule } from './postgres/postgres.module'
export { PostgresService } from './postgres/postgres.service'
export type { DrizzlePgConfig } from './common/database.interface'
export { DATABASE_OPTIONS } from './common/database.constants'
```

:::

:::tip ⚡提示
因为本项目所用的`ORM`框架`Drizzle`是一个火爆的新兴开源项目，社区中相关的`nestjs`插件还很少，所以只能自己动手封装了。采用的实现方式是**可配置构建器的动态模块**，相关文档可以参考[动态模块](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder)
:::

再新建如下四个文件用来编写一些数据库脚本

- `src/db.ts`
- `scripts/init.ts`
- `scripts/drizzle-action.ts`
- `drizzle.config.ts`

:::code-group

```ts [db.ts]
import path from 'path'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import dotenv from 'dotenv'
import { SchemaType, schemas } from '@capsule/schema'

const { parsed, error } = dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })
if (error || [void 0, ''].indexOf(parsed!.DATABASE_DSN) !== -1) {
  console.error(error || 'database url is empty or undefined')
  process.exit(1)
}

export default async () => {
  const client = new pg.Client({ connectionString: parsed!.DATABASE_DSN })
  await client.connect()
  return drizzle(client, { schema: schemas }) as NodePgDatabase<SchemaType>
}
```

```ts [init.ts]
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import inquirer from 'inquirer'
import shell from 'shelljs'

interface Q1 {
  start: boolean
}
interface Q2 {
  env: string
}
interface Q3 {
  copy: boolean
}
interface Q4 {
  docker: boolean
}
interface Q5 {
  data: boolean
}

const rootDir = path.resolve(process.cwd(), '../../')

/**
 * 搜索主项目根目录下的环境变量文件
 * @returns
 */
async function searchEnvFiles(): Promise<string[]> {
  const files = fs.readdirSync(rootDir)
  const res = files
    .filter((file) => file.startsWith('.env'))
    .filter((file) => file.indexOf('example') === -1)
  if (res.length === 0) {
    console.error('There is no found any environment files, please create one and run again !')
    process.exit(1)
  }
  return res
}

/**
 * 加载环境变量文件
 * @returns
 */
function loadEnv(file: string) {
  const { parsed, error } = dotenv.config({ path: path.resolve(process.cwd(), '../../', file) })
  if (error || [void 0, ''].indexOf(parsed!.DATABASE_DSN) !== -1) {
    console.error(error || 'database url is empty or undefined')
    process.exit(1)
  }
}

/**
 * 初始化数据
 */
function initializeData() {
  // 打包模型
  shell.exec('pnpm -F @capsule/schema run build')
  // 生成迁移文件
  shell.exec('drizzle-kit generate')
  // 执行迁移
  shell.exec('drizzle-kit migrate')
  // 上传数据
  shell.exec('pnpm -F @capsule/xingrong-course run upload')
}

/**
 * 问题列表
 * @returns
 */
async function questions() {
  let qa1: Q1 = { start: false }
  let qa2: Q2 = { env: '' }
  let qa3: Q3 = { copy: false }
  let qa4: Q4 = { docker: false }
  let qa5: Q5 = { data: false }
  let selectedEnv = ''

  // ①询问用户是否已经有环境变量文件
  qa1 = await inquirer.prompt([
    { name: 'start', message: 'Is there any environment files in your project ?', type: 'confirm' },
  ])

  // ②询问选择哪个环境,问题①为true时才有问题②
  if (qa1.start) {
    const envFiles = await searchEnvFiles()
    qa2 = await inquirer.prompt([
      { name: 'env', message: 'Select your environment', type: 'list', choices: envFiles },
    ])
    selectedEnv = qa2.env
  } else {
    // ③询问是否需要从模板文件复制一份,问题①为false时才有问题③
    qa3 = await inquirer.prompt([
      {
        name: 'copy',
        message: 'Do you want to copy an example environment file ?',
        type: 'confirm',
      },
    ])
    // 不同意就终止脚本
    if (!qa3.copy) {
      console.log('Stop init.')
      process.exit(0)
    }
  }

  // ④询问是否要执行docker-compose,不同意启动的话,就终止脚本
  qa4 = await inquirer.prompt([
    { name: 'docker', message: 'Do you want to start docker ?', type: 'confirm' },
  ])
  // 不同意就终止脚本
  if (!qa4.docker) {
    console.log('Stop init.')
    process.exit(0)
  }
  // ⑤询问是否要初始化数据
  qa5 = await inquirer.prompt([
    { name: 'data', message: 'Do you want to initialize course data ?', type: 'confirm' },
  ])

  return { qa3, qa4, qa5, selectedEnv }
}

async function main() {
  // 先检查是否有docker环境,没有的话就直接终止脚本
  const info = shell.exec(`docker version`, { silent: true })
  if (info.stderr) {
    console.error(info.stderr)
    console.error('\t\nThe docker is not running or installed, please run it first !')
    process.exit(1)
  }
  let { qa3, qa4, qa5, selectedEnv } = await questions()
  // 同意从模板文件复制一份
  if (qa3.copy) {
    shell.exec(`cp ${rootDir}/.env.example ${rootDir}/.env`)
    selectedEnv = '.env'
    loadEnv(selectedEnv)
  } else {
    // 问题①为true时直接加载选取的环境变量
    loadEnv(selectedEnv)
  }
  // 同意启动docker
  if (qa4.docker) {
    shell.exec('docker-compose up --build -d')
  }
  // 同意初始化数据
  if (qa5.data) {
    initializeData()
  }
  console.log('congratulations, all done')
}
await main()
```

```ts [drizzle-action]
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import inquirer from 'inquirer'
import shell from 'shelljs'

/**
 * 搜索主项目根目录下的环境变量文件
 * @returns
 */
async function searchEnvFiles(): Promise<string[]> {
  const files = fs.readdirSync(path.resolve(process.cwd(), '../../'))
  const res = files
    .filter((file) => file.startsWith('.env'))
    .filter((file) => file.indexOf('example') === -1)
  if (res.length === 0) {
    console.error('There is no found any environment files, please create one and run again!')
    process.exit(1)
  }
  return res
}

/**
 * 选择要加载的环境变量文件
 * @returns
 */
async function selectEnv(): Promise<{ env: string }> {
  const envFiles = await searchEnvFiles()
  const res = await inquirer.prompt([
    { name: 'env', message: 'select your environment', type: 'list', choices: envFiles },
  ])
  return res
}

async function main() {
  const qa1 = await selectEnv()
  const { parsed, error } = dotenv.config({ path: path.resolve(process.cwd(), '../../', qa1.env) })
  if (error || [void 0, ''].indexOf(parsed!.DATABASE_DSN) !== -1) {
    console.error(error || 'database url is empty or undefined')
    process.exit(1)
  }
  // 询问是否需要构建模型文件
  const qa2: { schema: boolean } = await inquirer.prompt([
    { name: 'schema', message: 'Is need to build the schema ?', type: 'confirm' },
  ])
  if (qa2.schema) {
    shell.exec('pnpm -F @capsule/schema run build')
  }
  const qa3: { action: string } = await inquirer.prompt([
    {
      name: 'action',
      message: 'Which action you want to do?',
      type: 'list',
      choices: ['generate', 'migrate', 'push'],
    },
  ])
  // generate 是生成迁移文件，更新模型schema文件后需要执行
  // migrate 是执行迁移操作，也就是把表结构的改动实际应用到数据库中
  // push 跳过生成迁移文件的步骤，直接改动数据库中的表结构，一般用于开发环境和模型设计阶段
  shell.exec(`drizzle-kit ${qa3.action}`)
}
await main()
```

```ts [drizzle.config]
import { defineConfig } from 'drizzle-kit'

if ([void 0, ''].indexOf(process.env.DATABASE_DSN) !== -1) {
  console.error('database url is empty or undefined')
  process.exit(1)
}

export default defineConfig({
  schema: '../schema/src/schemas/*', // 模型文件目录
  out: './drizzle', // 迁移文件的输出目录
  dialect: 'postgresql', // 数据库引擎
  dbCredentials: { url: process.env.DATABASE_DSN as string },
})
```

:::

接着在`@capsule/database`子项目下新建`rollup.config.js`文件用来配置打包，之前都是单入口文件打包，这次要做多入口文件打包处理。同时再次编辑`package.json`添加打包指令和包导出声明

:::code-group

```ts [rollup.config]
import ts from 'rollup-plugin-ts'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/index.js',
        format: 'es',
      },
    ],
    plugins: [ts()],
    watch: { exclude: 'node_modules/**' },
  },
  {
    input: './src/db.ts',
    output: [
      {
        file: 'dist/db.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/db.js',
        format: 'es',
      },
    ],
    plugins: [ts()],
    watch: { exclude: 'node_modules/**' },
  },
]
```

```json [package.json]
{
  // ...
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./dist/db": {
      "import": "./dist/db.js",
      "require": "./dist/db.cjs"
    }
  },
  "scripts": {
    "build": "rollup -c -m",
    "init": "tsx scripts/init.ts",
    "drizzle": "tsx scripts/drizzle-action.ts"
  }
}
```

:::

最后是在`server`项目引入此`@capsule/database`子项目作为依赖，并在`app`模块中注册此`database`模块

:::code-group

```ts{5-18} [app.module.ts]
import { ConfigModule, ConfigService } from '@capsule/config' // [!code hl]
import { PostgresModule } from '@capsule/database' // [!code ++]
import { schemas } from '@capsule/schema' // [!code ++]
@Module({
  imports: [
    PostgresModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          clientType: 'client',
          clientConfig: { connectionString: config.get('database').url },
          drizzleConfig: {
            logger: true,
            schema: schemas,
          },
        }
      },
    }),
  ],
})
export class AppModule {}
```

```json [package.json]
{
  "name": "server",
  // ...
  "dependencies": {
    "@capsule/database": "workspace:^" // [!code ++]
    // ...
  }
}
```

:::

在`server`项目中使用此`@capsule/database`数据库服务的示例如下

```ts
import { Injectable } from '@nestjs/common'
import { PostgresService } from '@capsule/database' // [!code ++]

@Injectable()
export class AppService {
  constructor(private readonly db: PostgresService) {} // [!code ++]
  async getHello(): Promise<string> {
    const res = await this.db.client.query.course.findMany() // [!code ++]
    return 'Hello World!'
  }
}
```
