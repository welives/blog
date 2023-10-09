::: tip 目标
搭建一个 Koa2 + TypeScript + PM2 + ESLint + Prettier 的工程
:::

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 基础配置

### 新建文件夹`server`并打开

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
npm i -D pm2
```

新建`ecosystem.config.js`，并写入如下内容

```js
const { name } = require('./package.json')
const path = require('path')

module.exports = {
  apps: [
    {
      name, // 应用程序名称
      cwd: './', // 启动应用程序的目录
      script: path.resolve(__dirname, './dist/index.js'), // 启动脚本路径
      instances: require('os').cpus().length, // 要启动的应用实例数量
      max_memory_restart: '1G', // 超过指定的内存量，应用程序将重新启动
      autorestart: true, // 自动重启
      watch: true, // 启用监视和重启功能
      // 开发环境变量
      env: {
        NODE_ENV: 'development'
      },
      // 生产环境变量
      env_production: {
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

项目根目录下新建`.env`和`.env.production`文件，根据项目需求写入自己的环境变量，如

```int
# 环境标识
NODE_ENV=development

# 应用配置
APP_HOST=localhost
APP_PORT=3000

# 数据库配置
DATABASE_URL=mysql://root:123456@localhost:3306/test

# 其他配置
```

`src`目录下新建`utils`文件夹，接着在`utils`文件夹下新建`load-env.ts`文件，并写入如下内容

```ts
import path from 'path'

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const envPath =
  NODE_ENV === 'development'
    ? path.resolve(process.cwd(), '.env')
    : path.resolve(process.cwd(), `.env.${NODE_ENV}`)

require('dotenv').config({ path: envPath })
```

修改入口文件`src/index.ts`，在第一行加上

```ts
import './utils/load-env'
```

### 配置`package.json`执行脚本

```json
{
  "main": "dist/index.js",
  // ...
  "scripts": {
    "dev": "nodemon",
    "clear": "rimraf dist/*",
    "build": "npm run clear && tsc",
    "start": "node_modules/.bin/pm2 start --env production",
    "stop": "node_modules/.bin/pm2 stop all"
  }
}
```

::: tip
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

最后生成的配置文件大概如下

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

## 配置`Prettier`

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

### 改写入口文件

```ts
import './utils/load-env'
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

app.listen(process.env.APP_PORT || 3000)
```

### 运行项目

至此，一个极简的`Koa`项目就搭建完成了，执行`npm run dev`并访问`http://localhost:3000/`，可以看到浏览器显示`Hello World`

### 打包和部署

生产环境使用 PM2 启动，可以达到负载均衡。执行`npm run build`打包项目，接着`npm run start`进行部署（生产环境端口默认：8080）
