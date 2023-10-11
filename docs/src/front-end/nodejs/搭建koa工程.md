::: tip 目标
搭建一个 Koa2 + TypeScript + PM2 + ESLint + Prettier 的工程
:::

相关文档

- [Koa2](https://koa.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [PM2](https://pm2.fenxianglu.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 基础配置

新建文件夹`server`并打开

```sh
mkdir server && cd server
```

### 初始化`git`

```sh
git init
touch .gitignore
```

设置忽略文件，内容根据自己的喜好

```ini
.DS_Store
node_modules
dist
.idea
.vscode
*.code-workspace
**/*.log
*lock.json
.env*
```

### 初始化`editorconfig`

新建`.editorconfig`，设置编辑器和 ide 规范，内容根据自己的喜好或者团队规范

```ini
# https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

### 初始化`npm`

```sh
npm init -y
```

### 安装`typescript`

```sh
npm i -D typescript @types/node
```

### 初始化`tsconfig.json`

```sh
npx tsc --init
```

初始化生成的`tsconfig.json`含有许多备注，如果嫌麻烦可以直接使用下面的模板，项目设定根据实际情况填写即可

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/@types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noImplicitAny": false,
    "forceConsistentCasingInFileNames": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "public"]
}
```

### 检验`typescript`环境

新建文件夹`src`并新建`index.ts`

```sh
mkdir src
touch src/index.ts
```

写入如下代码，然后编译`npx tsc`

```ts
console.log('hello world')
```

编译成功的话，项目根目录下会生成`dist`文件夹，里面有`index.js`

试试用`node dist/index.js`运行看看，输出`hello world`的话说明`typescript`环境搭建成功了，之后就可以继续完善工程了

## 配置执行脚本

此项目的开发环境使用`ts-node`和`nodemon`来运行项目和监听热重载，使用`dotenv`来注入环境变量，生产环境使用`pm2`来部署

### 安装`nodemon`

```sh
npm i -D nodemon ts-node tsconfig-paths
```

新建`nodemon.json`文件，并写入如下内容

```json
{
  "watch": ["src"],
  "ext": "ts,tsx",
  "delay": 1000,
  "verbose": true,
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

::: tip

- watch 表示监听的文件夹
- ext 表示监听的文件类型
- delay 表示延迟时间
- verbose 表示输出详细信息
- exec 表示执行的命令
  - tsconfig-paths 是用来识别`import`的路径别名

:::

### 安装`pm2`

```sh
npm i -D pm2 tsc-alias
```

新建`ecosystem.config.js`，并写入如下内容

```js
const { name } = require('./package.json')
const path = require('path')

module.exports = {
  apps: [
    {
      name, // 应用程序名称
      cwd: './dist', // 启动应用程序的目录
      script: path.resolve(__dirname, './dist/index.js'), // 启动脚本路径
      instances: require('os').cpus().length, // 要启动的应用实例数量
      max_memory_restart: '1G', // 超过指定的内存量，应用程序将重新启动
      autorestart: true, // 自动重启
      watch: true, // 启用监视和重启功能
      // 环境变量
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

### 安装`dotenv`

```sh
npm i -D dotenv
```

项目根目录下新建`.env`文件，根据项目需求写入自己的环境变量，如

```ini
# 应用配置
APP_HOST=localhost
APP_PORT=3000

# 数据库配置
DATABASE_URL=mysql://root:123456@localhost:3306/test
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=test
DB_CHARSET=utf8
DB_TIMEZONE=Asia/Shanghai

# 其他配置
```

修改入口文件`src/index.ts`，在第一行加上

```ts
import 'dotenv/config'
```

### 配置`package.json`执行脚本

```json
{
  "main": "dist/index.js",
  // ...
  "scripts": {
    "dev": "nodemon",
    "clear": "rimraf dist/*",
    "build": "npm run clear && cp .env.production dist/.env && tsc && tsc-alias",
    "start": "node_modules/.bin/pm2 start",
    "stop": "node_modules/.bin/pm2 stop all"
  }
}
```

::: tip
`tsc-alias`的作用是解决打包时不能识别路径别名的问题

如果是`Windows`系统的话，`start`和`stop`脚本中的斜杠`/`要改成`\\`
:::

## 初始化`ESLint`

```sh
npx eslint --init
```

选第二个

![](./assets/搭建koa工程/eslint_setup_1.png)

选第一个

![](./assets/搭建koa工程/eslint_setup_2.png)

因为不是前端项目，所以选第三个

![](./assets/搭建koa工程/eslint_setup_3.png)

是否使用`TypeScript`，选 Yes

`Does your project use TypeScript? » No / Yes`

所处运行环境，按`a`选择全部

![](./assets/搭建koa工程/eslint_setup_4.png)

`eslint`配置文件的的保存格式，选第一个

![](./assets/搭建koa工程/eslint_setup_5.png)

是否立即安装所需的依赖，选 Yes

![](./assets/搭建koa工程/eslint_setup_6.png)

这里根据项目构建所使用的包管理器进行选择，因为本项目使用`npm`，所以选第一个

![](./assets/搭建koa工程/eslint_setup_7.png)

最后生成的配置文件大致如下

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

### 配置忽略文件

新建`.eslintignore`文件，并写入如下配置，可根据自己喜好进行调整

```ini
.DS_Store
node_modules
dist
.idea
.vscode
```

## 安装`Prettier`

安装依赖

```sh
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

新建`.prettierrc`文件，并写入如下配置，可以根据自己喜好进行调整

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "all"
}
```

### 在`.eslintrc.js`中集成`prettier`

```js
module.exports = {
  // ...
  extends: [
    // ...
    'prettier',
    'prettier/@typescript-eslint'
  ],
  rules: {
    'prettier/prettier': 'error'
    // ...
  }
}
```

### 配置忽略文件

新建`.prettierignore`文件，并写入如下配置，可以根据自己喜好进行调整

```ini
.DS_Store
node_modules
dist
.idea
.vscode
*.md
*.json
```

## 安装`Koa`和相关插件

```sh
npm i koa koa-router koa-bodyparser
npm i -D @types/koa @types/koa-router @types/koa-bodyparser
```

### 创建路由

新建控制器`src/core/controllers/user.controller.ts`和路由`src/core/routes/index.ts`，具体参考如下目录结构

```
.
├─ src
│  ├─ core
│  │  ├─ controllers
│  │  │  └─ user.controller.ts
│  │  ├─ routes
│  │  │  └─ index.ts
...
```

::: code-group

```ts [routes/index.ts]
import Router from 'koa-router'
import UserController from '~/core/controllers/user.controller'

const router = new Router()
router.get('/user', UserController.getUser)

export default router
```

```ts [user.controller.ts]
import { Context } from 'koa'

export default class UserController {
  public static async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: { name: 'jandan', email: '10000@qq.com' }
    }
  }
}
```

:::

### 改写入口文件

新建`src/app.ts`文件，并写入如下内容

```ts
import Koa from 'koa'
import router from './core/routes'
const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app
```

修改入口文件`src/index.ts`

```ts
import 'dotenv/config'
import app from './app'
const PORT = process.env.APP_PORT || 3000
app.listen(PORT, () => {
  console.info('Server listening on port: ' + PORT)
})
```

### 运行项目

至此，一个极简的`Koa`项目就搭建完成了，执行`npm run dev`并访问`http://localhost:3000`，可以看到浏览器显示`Hello World`

使用接口调试工具访问`http://localhost:3000/user`，可以看到如下输出

```json
{
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "name": "jandan",
    "email": "10000@qq.com"
  }
}
```

### 打包和部署

在项目根目录新建`.env.production`文件，填入生产环境所需的环境变量

执行`npm run build`打包项目，接着可以用`node`来启动预览

```sh
export NODE_ENV=production
node dist/index.js dotenv_config_path=dist/.env
```

也可以直接`npm run start`使用 PM2 启动

::: tip
生产环境使用 PM2 启动（生产环境端口默认：8080），可以达到负载均衡
:::

## 连接数据库

### 使用Typeorm

安装相关依赖

```sh
npm i typeorm mysql reflect-metadata
```

#### 创建数据库服务

我这里使用的是一个[免费的线上`MySQL`服务](https://methodot.com/)进行临时测试，具体可以根据自己手头上的资源进行选择

创建完毕后将相关配置信息填入环境变量文件`.env`

#### 模型定义

新建模型`src/core/entities/user.entity.ts`

::: details 查看

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
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

:::

#### 配置数据库

新建数据库配置`src/config/db.ts`

::: details 查看

```ts
import path from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
const DATABASE_URL = process.env.DATABASE_URL

const config: DataSourceOptions = {
  ...(DATABASE_URL
    ? { url: DATABASE_URL }
    : {
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string),
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string
      }),
  type: 'mysql',
  timezone: process.env.DB_TIMEZONE,
  charset: process.env.DB_CHARSET,
  synchronize: true,
  logging: false,
  entities: [path.resolve(__dirname, '../core/entities/*.entity.{js,ts}')]
}

const DBSource = new DataSource(config)
export default DBSource
```

:::

#### CURD

修改`src/core/controllers/user.controller.ts`，新建`src/core/services/user.service.ts`

::: details 查看
::: code-group

```ts [user.controller.ts]
import { Context } from 'koa'
import UserService from '../services/user.service'

export default class UserController {
  public static async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: await UserService.getUser()
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

#### 路由调整

修改`src/routes/index.ts`，新建`src/routes/v1/index.ts`

::: details 查看
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

#### 连接数据库

修改`src/app.ts`

```ts
import Koa from 'koa'
import { V1Router } from './core/routes'
const app = new Koa()
app.use(V1Router.routes()).use(V1Router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app
```

修改入口文件`src/index.ts`，初始化连接

```ts
import 'dotenv/config'
import 'reflect-metadata'
import app from './app'
import DBSource from './config/db'
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

#### 目录结构

```

.
├─ src
│  ├─ config                    # 配置文件目录
│  │  └─ db.ts
│  ├─ core                      # 业务核心目录
│  │  ├─ controllers            # 控制器层
│  │  │  └─ user.controller.ts
│  │  ├─ entities               # 模型层
│  │  │  └─ user.entity.ts
│  │  ├─ services               # 服务层
│  │  │  └─ user.service.ts
│  │  ├─ routes                 # 路由
│  │  │  ├─ v1                  # 路由版本
│  │  │  │  └─ index.ts
│  │  │  └─ index.ts
│  ├─ app.ts                    # koa 实例
│  └─ index.ts                  # 入口文件
```
