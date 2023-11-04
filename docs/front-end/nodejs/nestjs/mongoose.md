---
title: NestJS使用Mongoose
---

先前我们已经创建好了一个[基础的`NestJS`工程](./create.md)，接下来我们来给它加上数据库功能

本例子将使用`Mongoose`连接数据库

## 创建数据库服务

我这里使用的是一个[免费的线上服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件

## 安装依赖

```sh
pnpm add mongoose @nestjs/mongoose
pnpm add -D @types/mongoose
```

## 数据库配置

修改`apps/api/src/app.module.ts`，在`imports`中增加`MongooseModule`配置项和相关的环境变量

```ts
// ...
import { MongooseModule } from '@nestjs/mongoose' // [!code ++]
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // ...
        MONGODB_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('MONGODB_URL'),
        }
      },
    }),
  ],
  // ...
})
```

## 定义模型

新建`apps/api/src/schemas/user.schema.ts`

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
export enum UserStatus {
  NORMAL = 0, // 正常
  LOCKED = 1, // 锁定
  BANNED = 2, // 封禁
}
export type UserDocument = User & Document
@Schema({ versionKey: false })
export default class User extends Document {
  @Prop({ required: true, unique: true })
  username: string
  @Prop({ required: true })
  password: string
  @Prop({ required: true })
  salt: string
  @Prop({ default: '' })
  avatar: string
  @Prop({ default: 0 })
  role: number
  @Prop({ default: UserStatus.NORMAL, enum: UserStatus })
  status: UserStatus
}
export const UserSchema = SchemaFactory.createForClass(User)
```

## CURD

这里以`Auth`模块为例

修改`auth.module.ts`，导入`User`模型

```ts
import { MongooseModule } from '@nestjs/mongoose' // [!code ++]
import User, { UserSchema } from '../schemas/user.schema' // [!code ++]
@Module({
  imports: [
    // ...
    MongooseModule.forFeature([{ name: User.name, collection: 'user', schema: UserSchema }]) // [!code ++]
  ],
  // ...
})
```

修改`auth.service.ts`，把之前的模拟数据替换为从数据库查出来的

```ts
import { InjectModel } from '@nestjs/mongoose' // [!code ++]
import { Model } from 'mongoose' // [!code ++]
import User, { UserDocument, UserStatus } from '../schemas/user.schema' // [!code ++]
export class AuthService {
  constructor(
    // ...
    @InjectModel(User.name) private readonly userModel: Model<UserDocument> // [!code ++]
  ) {}
  async validateUser(data: { username: string; password: string }): Promise<ValidResult> {
    const user = await this.userModel.findOne({ username: data.username }).exec() // [!code ++]
    // ...
    const { password, salt, _id, ...result } = user.toJSON()
    return {
      type: 'NORMAL',
      message: 'ok',
      result: { ...result, id: user.id },
    }
  }
}
```
