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

## 基本语法

[详细的文档看这里](https://www.selenium.dev/selenium/docs/api/javascript/index.html)

### 选择器

```ts
await driver.findElement() // 查找单个元素
await driver.findElements() // 查找多个元素

By.id('xxx')
By.css('.xxx') // 类似 jQuery的 $()

getText() // 获取标签内容
// 一般都会结合一起使用
await driver.findElement(By.css('.xxx')).getText() // 类似jQuery的 $(".xxx").val()
```

### 获取属性

```ts
// 获取包裹在 xxx 内的所有标签
await driver.findElement(By.css('.xxx')).getAttribute('innerHTML')
await driver.findElement(By.css('.xxx')).getAttribute('ka') // 获取属性ka的值 attr
```

### 按钮点击

```ts
await driver.findElement(By.id('xxx')).click()
```

### 表单操作

```ts
await driver.findElement(By.id('xxx')).sendKeys('要输入的内容')
await driver.findElement(By.id('xxx')).clear() // 清空元素的值
```

### 休眠

一般用于降低抓取速度，防止操作太快触发反爬机制

```ts
await driver.sleep(1000) // 毫秒
```

### 执行脚本

```ts
// 修改样式
await driver.executeScript(`document.getElementsByClassName('info-detail')[0].style.zIndex = '-1';`)
```

### 切换窗体

- 切换到`iframe`

网页中常常会嵌入一些`iframe`，或者是标签页面或者是弹窗的形式。这时要操作`iframe`里面的元素前就需把当前窗体切换到`iframe`，切换后的所有操作都是针对`iframe`，在`iframe`内的操作结束后需切换回主窗体

```ts
await driver.switchTo().frame(driver.findElement(By.id('iframe-id')))
```

- 切换到弹窗

有时候一些网页会弹出一些操作提示，提示框会堵塞整个任务的执行，需将其关闭(只针对原生的 JS 弹出框)

```ts
driver
  .switchTo()
  .alert()
  .then(
    function (alert) {
      //检测到弹出框时执行
      return alert.dismiss() // 关闭alert
    },
    function () {
      //没有检测到弹出框时执行
    }
  )
```

- 切换回主窗体

```ts
await driver.switchTo().defaultContent()
```

- 切换到新的浏览器标签页

有时候需要爬取网页的一些内页数据，点击链接后会打开一个新的标签页，但此时的窗体还停留在原来的页面，这时需要把窗体指向到新的标签页

```ts
const windowHandle = await driver.getAllWindowHandles() // 获取浏览器所有标签页的句柄
await driver.switchTo().window(windowHandle[1]) // 将句柄定位到新的标签页
```
