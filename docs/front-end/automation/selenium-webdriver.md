---
title: selenium-webdriver学习
---

## 项目搭建

::: tip 搭建一个 Selenium + TypeScript + ESLint + Prettier 的工程
:::

相关文档

- [Selenium](https://www.selenium.dev/zh-cn/documentation/)
- [selenium-webdriver](https://www.selenium.dev/selenium/docs/api/javascript/index.html)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

### 初始化

::: code-group

```sh
# 初始化版本仓库
git init
touch .gitignore
# 初始化工程
pnpm init
pnpm add -D typescript @types/node
# 初始化ts配置
npx tsc --init
mkdir src
# 初始化ESLint
npx eslint --init
touch .eslintignore
# 初始化Prettier
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
touch .prettierrc
touch .prettierignore
```

```ini [.gitignore]
.DS_Store
node_modules
.idea
.vscode
*.code-workspace
**/*.log
.env
.env.*
```

```json [tsconfig.json]
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/@types"],
    "moduleResolution": "node",
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

```js [.eslintrc.js]
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
    'prettier/@typescript-eslint',
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
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

```ini [.eslintignore]
.DS_Store
node_modules
dist
.idea
.vscode
```

```json [.prettierrc]
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

```ini [.prettierignore]
.DS_Store
node_modules
dist
.idea
.vscode
```

:::

### 安装Chrome

如果已经有了则跳过此步骤或者更新到最新版本

### 安装依赖

::: code-group

```sh
pnpm add selenium-webdriver chromedriver
pnpm add -D @types/selenium-webdriver nodemon ts-node tsconfig-paths cross-env dotenv
touch nodemon.json
```

```json [nodemon.json]
{
  "watch": ["src", ".env"],
  "ext": "ts,tsx",
  "delay": 1000,
  "verbose": true,
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

```json [package.json]
{
  "scripts": {
    "start": "nodemon" // [!code ++]
  }
}
```

:::

- 安装`Chrome`，如果已经有了则跳过或者更新到最新版本
- 如果不使用`chromedriver` NPM 包的话，那就去下载软件版的[ChromeDriver](https://chromedriver.chromium.org/downloads)，注意版本最好要和`Chrome`版本一致

### 检验工程

把[官方文档](https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/node/selenium-webdriver#usage)上的案例扒下来稍微修改一下，代码如下

```ts
import { Builder, Browser, By, Key, until } from 'selenium-webdriver'
;(async function example() {
  // 实例化浏览器驱动
  let driver = await new Builder().forBrowser(Browser.CHROME).build()
  try {
    await driver.get('https://www.baidu.com') // 请求站点
    // 寻找元素,发送关键字后按回车
    await driver.findElement(By.id('kw')).sendKeys('煎蛋网', Key.RETURN)
    // 验证搜索是否成功
    await driver.wait(until.titleIs('煎蛋网_百度搜索'), 1000)
  } finally {
    // 先注释起来,不然调起的浏览器一闪而过,都看不到发生了什么
    // await driver.quit() // 退出
  }
})()
```

执行`pnpm dev`，可以看到调起的浏览器执行了我们想要的操作

![元気が出る](/よし、元気が出る.gif)

![](./assets/检验selenium工程.png)

## 实战

使用`selenium-webdriver`爬取 BOSS直聘网站的招聘信息

To be continued...
