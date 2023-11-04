---
title: Koa工程搭建
---

::: tip ✨
搭建一个 Koa2 + TypeScript + Webpack + PM2 + ESLint + Prettier 的工程

[本工程的Github地址](https://github.com/welives/koa-starter)
:::

相关文档

- [Koa2](https://koa.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [Webpack](https://webpack.docschina.org/)
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

::: details 查看

```ini
# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# IDEs and editors
/.idea
.project
.vscode
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
*.code-workspace

# local env files
.env*.local
*.rest
*.http
```

:::

### 配置`EditorConfig`

新建`.editorconfig`，设置编辑器和 IDE 规范，内容根据自己的喜好或者团队规范

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

### 初始化项目

```sh
pnpm init -y
```

### 安装`TypeScript`

```sh
pnpm add -D typescript @types/node
```

### 初始化`tsconfig.json`

```sh
npx tsc --init
```

初始化生成的`tsconfig.json`含有许多备注，如果嫌麻烦可以直接使用下面的模板，项目设定根据实际情况填写即可

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "esnext",
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/@types"],
    "moduleResolution": "node",
    "declaration": true,
    "allowSyntheticDefaultImports": true,
    "incremental": true,
    "strictNullChecks": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false,
    "sourceMap": true,
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

### 检验`TypeScript`环境

新建`src/index.ts`

```sh
mkdir src && touch src/index.ts
```

写入如下代码，然后编译`npx tsc`

```ts
console.log('hello world')
```

编译成功的话，项目根目录下会生成`dist`文件夹，里面有`index.js`

试试用`node dist/index.js`运行看看，输出`hello world`的话说明`typescript`环境搭建成功了，之后就可以继续完善工程了

## 代码规范

### 安装`ESLint`

```sh
npx eslint --init
```

选第二个

![](../assets/koa/eslint_setup_1.png)

选第一个

![](../assets/koa/eslint_setup_2.png)

因为不是前端项目，所以选第三个

![](../assets/koa/eslint_setup_3.png)

选`TypeScript`，然后运行环境按`a`全选

![](../assets/koa/eslint_setup_4.png)

`eslint`配置文件的的保存格式，选第一个

![](../assets/koa/eslint_setup_5.png)

是否立即安装所需的依赖，选 Yes

![](../assets/koa/eslint_setup_6.png)

这里根据项目构建所使用的包管理器进行选择，因为本项目使用`pnpm`，所以选第三个

![](../assets/koa/eslint_setup_7.png)

### 安装`Prettier`

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

新建`.prettierrc`文件，并写入如下配置，可以根据自己喜好进行调整

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

新建`.eslintignore`和`.prettierignore`文件，并写入如下配置，可以根据自己喜好进行调整

::: code-group

```ini [.eslintignore]
.DS_Store
node_modules
dist
.idea
.vscode
```

```ini [.prettierignore]
.DS_Store
node_modules
dist
.idea
.vscode
```

:::

### 在`.eslintrc.js`中集成`prettier`

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

## 配置执行脚本

此项目的开发环境使用`ts-node`和`nodemon`来运行项目和监听热重载，使用`dotenv`来注入环境变量，生产环境使用`pm2`来部署

### 环境变量

```sh
pnpm add -D dotenv dotenv-expand cross-env
```

根目录下新建`.env`或`.env.local`文件，根据项目需求写入自己的环境变量，如

```ini
NODE_ENV=development
# 应用配置
APP_HOST=localhost
APP_PORT=3000

# 数据库配置
MYSQL_URL=mysql://root:123456@localhost:3306/test
MONGODB_URL=mongodb://root:123456@localhost:27017/test
```

新建`src/env.ts`，用来加载多环境变量配置文件

```ts
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { expand } from 'dotenv-expand'

/** 同步读取文件 */
function tryStatSync(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {}
}
/** 获取env文件列表 */
function getEnvFilesForMode(mode: string): string[] {
  return [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ]
}

/** 加载环境变量 */
function loadEnv(envDir: string) {
  const envFiles = getEnvFilesForMode(process.env.NODE_ENV ?? 'development')
  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      const filePath = path.join(envDir, file)
      if (!tryStatSync(filePath)?.isFile()) return []
      return Object.entries(parse(fs.readFileSync(filePath)))
    })
  )
  expand({ parsed })
  return parsed
}
loadEnv(path.resolve(__dirname, '../'))
```

修改入口文件`src/index.ts`，在第一行加上

```ts
import './env' // [!code ++]
// ...
```

### 安装`nodemon`

```sh
pnpm add -D nodemon ts-node tsconfig-paths
```

新建`nodemon.json`文件，并写入如下内容

```json
{
  "watch": ["src", ".env", ".env.local"],
  "ext": "ts,tsx",
  "delay": 1000,
  "verbose": true,
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

::: tip

- watch 表示要监听的文件或文件夹
- ext 表示监听的文件类型
- delay 表示延迟时间
- verbose 表示输出详细信息
- exec 表示执行的命令
  - tsconfig-paths 是用来识别`import`的路径别名

:::

### 安装`pm2`

```sh
pnpm add -D pm2 tsc-alias
```

根目录新建`ecosystem.config.js`，并写入如下内容

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
        NODE_ENV: 'production',
      },
    },
  ],
}
```

### 修改`package.json`

```json
{
  "main": "dist/index.js", // [!code focus]
  // ...
  "scripts": {
    // [!code focus:7]
    "dev": "nodemon",
    "clear": "rm -rf dist/*",
    "build": "cross-env NODE_ENV=production npm run clear && cp .env.production dist/ && tsc && tsc-alias",
    "preview": "cross-env NODE_ENV=production node dist/index.js dotenv_config_path=.env.production",
    "deploy": "pm2 start",
    "deploy:stop": "pm2 stop all"
  }
}
```

::: tip
`tsc-alias`的作用是解决打包时不能识别路径别名的问题
:::

## 安装`Koa`和相关插件

```sh
pnpm add koa koa-router koa-bodyparser
pnpm add -D @types/koa @types/koa-router @types/koa-bodyparser
```

### 创建路由

新建控制器`src/controllers/user.controller.ts`和路由`src/routes/index.ts`，具体参考如下目录结构

```
.
├─ src
│  ├─ controllers
│  │  └─ user.controller.ts
│  ├─ routes
│  │  └─ index.ts
...
```

::: code-group

```ts [routes/index.ts]
import Router from 'koa-router'
import UserController from '../controllers/user.controller'

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
      data: { name: 'jandan', email: '10000@qq.com' },
    }
  }
}
```

:::

### 改写入口文件

新建`src/app.ts`，修改入口文件`src/index.ts`

::: code-group

```ts [app.ts]
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './routes'
const app = new Koa()
app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app
```

```ts [index.ts]
import './env'
import app from './app'
const PORT = process.env.APP_PORT || 3000
app.listen(PORT, () => {
  console.info('Server listening on port: ' + PORT)
})
```

:::

### 运行项目

至此，一个极简的`Koa`项目就搭建完成了，执行`pnpm run dev`并访问`http://localhost:3000`，可以看到浏览器显示`Hello World`

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

## 打包

本项目有两种打包方式，默认打包和`Webpack`打包

### 默认打包

默认的打包方式是使用`tsc`进行打包，这种方式会保留代码的目录结构，而且不会压缩代码

执行`pnpm run build`进行默认打包

### `Webpack`打包

`Webpack`打包方式会将所有业务代码压缩到一个`js`文件中

- 安装相关依赖

```sh
pnpm add -D webpack webpack-cli webpack-dev-server webpack-merge webpack-node-externals terser-webpack-plugin ts-loader
```

- 根目录下创建`webpack.config.js`，参考配置如下

::: details 查看

```js
'use strict'
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

const config = {
  context: __dirname, // 指定webpack的工作目录
  target: 'node', // koa项目仅在node环境下运行
  entry: path.resolve(__dirname, 'src/index.ts'), // 打包模块入口文件
  // 打包的输出配置
  output: {
    clean: true, // 每次打包前清理输出文件夹
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'), // 指定loader要处理的目录
        exclude: ['/node_modules/'], // 排除的目录
      },
    ],
  },
  // 解析规则
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], // 解析模块时应该搜索的目录
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // 要解析的文件类型
    // 路径别名
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  externals: [nodeExternals()], // 打包时忽略node_modules中的第三方依赖
  plugins: [new webpack.ProgressPlugin()],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
}

module.exports = () => {
  return isProd
    ? merge(config, {
        mode: 'production',
        stats: {
          children: false, // 是否添加关于子模块的信息
          warnings: false, // 禁用告警
        },
        // 优化配置
        optimization: {
          // 压缩配置
          minimize: true,
          minimizer: [new TerserPlugin()],
        },
      })
    : merge(config, {
        mode: 'development',
        devtool: 'eval-source-map',
        stats: {
          children: false, // 是否添加关于子模块的信息
          modules: false, // 不显示模块信息
        },
      })
}
```

:::

- 修改`package.json`脚本，执行`pnpm run webpack`进行打包

```json
{
  "scripts": {
    // ..
    "watch": "cross-env NODE_ENV=development webpack --watch --progress", // [!code ++]
    "debug": "nodemon --exec node dist/index.js", // [!code ++]
    "webpack": "cross-env NODE_ENV=production webpack --progress && cp .env.production dist/" // [!code ++]
    // ..
  }
}
```

## 部署

根目录新建`.env.production`文件，填入生产环境所需的环境变量

打包好之后执行`pnpm run preview`来载入生产环境变量进行预览,

也可以直接`pnpm run deploy`使用`PM2`启动

::: tip
生产环境使用`PM2`启动（生产环境端口默认：8080），可以达到负载均衡
:::
