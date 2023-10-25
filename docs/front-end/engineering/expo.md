---
title: 使用Expo搭建工程
---

::: tip ✨
搭建一个 Expo + TailwindCSS + TypeScript + ESLint + Prettier 的工程

[本工程的Github地址](https://github.com/welives/expo-starter)
:::

相关文档

- [Expo](https://expo.dev/)
- [ReactNative](https://reactnative.cn/)
- [TypeScript](https://www.tslang.cn/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制
- AndroidStudio：Android 虚拟机调试 App

## 初始化项目

```sh
pnpm create expo-app -t expo-template-blank-typescript
```

由于使用`pnpm`创建的 Expo 项目缺少了`.npmrc`文件，我们需要在项目根目录手动创建它，填入如下内容

```ini
node-linker=hoisted
```

接着删除`node_modules`目录和`pnpm-lock.yaml`文件，然后重新执行一遍依赖的安装

```sh
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

最后执行`pnpm start`启动项目，不出意外的话就会唤起 Android 虚拟机打开 App 了

这样就创建好一个以 Expo 为脚手架的基础工程了，接下来我们对这个它做亿点点额外的配置

## 调整目录结构

项目根目录新建`src`文件夹，把`App.tsx`移入其中，新建`index.ts`文件作为应用入口，并填入以下内容

::: code-group

```sh
mkdir src
mv App.tsx src/App.tsx
touch index.ts
```

```ts [index.ts]
import { registerRootComponent } from 'expo'
import App from './src/App'

registerRootComponent(App)
```

```json [package.json]
{
  // ...
  "main": "index.ts" // [!code ++]
}
```

:::

## 配置EditorConfig

新建`.editorconfig`，设置编辑器和 IDE 规范，内容根据自己的喜好或者团队规范

::: code-group

```sh
touch .editorconfig
```

```ini [.editorconfig]
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

:::

## 初始化`ESLint`

```sh
npx eslint --init
```

选第二个

![](./assets/nuxt/eslint_setup_1.png)

选第一个

![](./assets/nuxt/eslint_setup_2.png)

选其他，因为等下会安装RN社区的整合插件

![](./assets/expo/eslint_setup_3.png)

选`TypeScript`，然后运行环境按`a`全选

![](./assets/nuxt/eslint_setup_4.png)

`ESLint`配置文件的的保存格式，选第一个

![](./assets/nuxt/eslint_setup_5.png)

是否立即安装所需的依赖，选 Yes

![](./assets/nuxt/eslint_setup_6.png)

这里根据项目构建所使用的包管理器进行选择，因为本项目使用`pnpm`，所以选第三个

![](./assets/nuxt/eslint_setup_7.png)

新建`.eslintignore`文件，填入自己喜欢的配置

::: code-group

```sh
touch .eslintignore
```

```ini [.eslintignore]
node_modules
android
ios
.expo
.expo-shared
.vscode
.idea
```

:::

### RN社区的ESLint插件

```sh
pnpm add -D @react-native-community/eslint-plugin @react-native-community/eslint-config
```

## 安装`Prettier`

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier eslint-config-universe
```

新建`.prettierrc`和`.prettierignore`文件，填入自己喜欢的配置

::: code-group

```sh
touch .prettierrc
touch .prettierignore
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
node_modules
android
ios
.expo
.expo-shared
.vscode
.idea
```

:::

### 整合`ESLint`和`Prettier`

编辑`.eslintrc.js`

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
    '@react-native-community',
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
  plugins: ['@react-native-community', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

## 安装`TailwindCSS`

::: code-group

```sh
pnpm add -D tailwindcss
npx tailwindcss init
```

```js [tailwind.config.js]
const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: { colors },
  },
  plugins: [],
}
```

:::

由于 `TailwindCSS` 使用的样式单位是 Web 端的，在 App 端不支持，需要安装一个插件来做转换处理

```sh
pnpm add twrnc
```
