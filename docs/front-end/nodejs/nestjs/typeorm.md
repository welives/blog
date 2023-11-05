---
title: NestJS使用Typeorm
---

先前我们已经创建好了一个[基础的`NestJS`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Typeorm`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## 安装依赖

```sh
pnpm add @nestjs/typeorm typeorm mysql2
```

如果用 MongoDB 的话

```sh
pnpm add @nestjs/typeorm typeorm mongodb
```

## 数据库配置

修改`apps/api/src/app.module.ts`，在`imports`中增加`TypeOrmModule`配置项和相关的环境变量

::: code-group

```ts [mysql]
import { TypeOrmModule } from '@nestjs/typeorm' // [!code ++]
// @ts-ignore
const moduleFiles = require.context('./models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath: string) => {
  const value = moduleFiles(modelPath)
  // 单个导出时
  // const [entity] = Object.values(value).filter((v) => typeof v === 'function' && v.toString().slice(0, 5) === 'class')
  // 默认导出时
  return [...model, value.default]
}, [])
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // ...
        MYSQL_URL: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().default(3306),
        MYSQL_USER: Joi.string().default('root'),
        MYSQL_PWD: Joi.string().required(),
        MYSQL_DBNAME: Joi.string().required(),
        CHARSET: Joi.string().default('utf8'),
        TIMEZONE: Joi.string().default('Asia/Shanghai'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const MYSQL_URL = config.get('MYSQL_URL')
        const typeormCofnig = MYSQL_URL
          ? { url: MYSQL_URL }
          : {
              host: config.get('MYSQL_HOST'),
              port: config.get('MYSQL_PORT'),
              username: config.get('MYSQL_USER'),
              password: config.get('MYSQL_PWD'),
              database: config.get('MYSQL_DBNAME'),
            }
        return {
          type: 'mysql',
          ...typeormCofnig,
          // 搞不懂这种方式为什么不生效, 无奈改用动态导入模块的方式
          // entities: [__dirname + '/**/*.entity.{ts,js}'],
          entities: models,
          charset: config.get('CHARSET'),
          synchronize: config.get('NODE_ENV') !== 'production' ? false : true,
          autoLoadEntities: true,
        }
      },
    }),
  ],
  // ...
})
```

```ts [mongodb]
import { TypeOrmModule } from '@nestjs/typeorm' // [!code ++]
// @ts-ignore
const moduleFiles = require.context('./models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath: string) => {
  const value = moduleFiles(modelPath)
  // 单个导出时
  // const [entity] = Object.values(value).filter((v) => typeof v === 'function' && v.toString().slice(0, 5) === 'class')
  // 默认导出时
  return [...model, value.default]
}, [])
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // ...
        MONGODB_URL: Joi.string().required(),
        MONGODB_HOST: Joi.string().required(),
        MONGODB_PORT: Joi.number().default(27017),
        MONGODB_USER: Joi.string().default('root'),
        MONGODB_PWD: Joi.string().required(),
        MONGODB_DBNAME: Joi.string().required(),
        CHARSET: Joi.string().default('utf8'),
        TIMEZONE: Joi.string().default('Asia/Shanghai'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const MONGODB_URL = config.get('MONGODB_URL')
        const typeormCofnig = MONGODB_URL
          ? { url: MONGODB_URL }
          : {
              host: config.get('MONGODB_HOST'),
              port: config.get('MONGODB_PORT'),
              username: config.get('MONGODB_USER'),
              password: config.get('MONGODB_PWD'),
              database: config.get('MONGODB_DBNAME'),
            }
        return {
          type: 'mongodb',
          ...typeormCofnig,
          // 搞不懂这种方式为什么不生效, 无奈改用动态导入模块的方式
          // entities: [__dirname + '/**/*.entity.{ts,js}'],
          entities: models,
          charset: config.get('CHARSET'),
          synchronize: config.get('NODE_ENV') !== 'production' ? false : true,
          autoLoadEntities: true,
        }
      },
    }),
  ],
  // ...
})
```

:::

## 定义模型

新建`apps/api/src/models/user.entity.ts`

::: code-group

```ts [mysql]
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
export enum UserStatus {
  NORMAL = 0, // 正常
  LOCKED = 1, // 锁定
  BANNED = 2, // 封禁
}
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

修改`apps/api/src/auth/auth.service.ts`，把之前的模拟数据替换为从数据库查出来的

```ts
import { InjectEntityManager } from '@nestjs/typeorm' // [!code ++]
import { EntityManager } from 'typeorm' // [!code ++]
import User, { UserStatus } from '../models/user.entity' // [!code ++]
export class AuthService {
  constructor(
    // ...
    @InjectEntityManager() private manager: EntityManager // [!code ++]
  ) {}
  async validateUser(data: { username: string; password: string }): Promise<ValidResult> {
    const user = await this.manager.findOneBy(User, { username: data.username }) // [!code ++]
    // ...
  }
}
```
