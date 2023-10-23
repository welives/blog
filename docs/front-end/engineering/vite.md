---
title: 使用Vite搭建工程
---

::: tip ✨
搭建一个 Vite + TailwindCSS + TypeScript + ESLint + Prettier 的工程

UI框架以 Vant 为例

[本工程的Github地址](https://github.com/welives/ts-vite-starter)
:::

相关文档

- [Vite](https://cn.vitejs.dev/)
- [Vant](https://vant-ui.github.io/vant/#/zh-CN)
- [TypeScript](https://www.tslang.cn/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 初始化项目

```sh [pnpm]
pnpm create vue
```

![初始化](./assets/vite/vite-vue.png)

然后按照提示操作即可，这样一个基础项目就创建好了

::: tip
通过上述交互式命令的选项，我们创建了一个带有`vue-router`、`pinia`、`ESLint`和`Prettier`的基于 Vite 脚手架的 Vue 项目
:::

## 初始化`git`

```sh
git init
```

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

## `ESLint`和`Prettier`的忽略文件

新建`.eslintignore`和`.prettierignore`文件，填入自己喜欢的配置

::: code-group

```sh
touch .eslintignore
touch .prettierignore
```

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

## 安装TailwindCSS

安装依赖

```sh
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

编辑`tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
delete colors.lightBlue // [!code ++]
delete colors.warmGray // [!code ++]
delete colors.trueGray // [!code ++]
delete colors.coolGray // [!code ++]
delete colors.blueGray // [!code ++]
export default {
  content: ['./index.html', './src/**/*.{vue,jsx,tsx}'], // [!code ++]
  theme: {
    colors: { ...colors }, // [!code ++]
    extend: {},
  },
  // ...
}
```

编辑`src/assets/main.css`，增加如下内容

```css
@tailwind base; // [!code ++]
@tailwind components; // [!code ++]
@tailwind utilities; // [!code ++]
```

## 配置环境变量

关于 Vite 的环境变量详细文档[看这里](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

新建`.env.local`文件，填入项目所需的环境变量。注意，环境变量名必须以`VITE_`开头，否则不会被识别，例如

```ini
VITE_APP_NAME=ts-vant-starter
VITE_APP_HOST=localhost
VITE_APP_PORT=5173
VITE_API_SECRET=secret_string
```

编辑`env.d.ts`，给自定义的环境变量添加类型

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_HOST: string
  readonly VITE_APP_PORT: string
  readonly VITE_API_SECRET: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 使用环境变量

vite 脚手架规定了`src`目录下的文件属于浏览器环境，而`vite.config.ts`文件属于 Node 环境，所以在使用上有点区别

- 在`src`目录下的文件中，通过`import.meta.env`读取环境变量
- 在`vite.config.ts`文件中，通过`loadEnv`方法读取环境变量

```ts
// ...
import { defineConfig, loadEnv } from 'vite' // [!code ++]
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // [!code ++]
  // ...
})
```

::: tip 🎉
到这里，基于 Vite 的基础项目模板就搭建完成了
:::

## 使用Vant作为UI库

```sh
pnpm add vant
```

### 给Vant配置按需引入

```sh
pnpm add -D @vant/auto-import-resolver unplugin-vue-components
```

编辑`vite.config.js`，在`plugins`中增加`Components({ resolvers: [VantResolver()] })`

```js
// ...
import Components from 'unplugin-vue-components/vite' // [!code ++]
import { VantResolver } from '@vant/auto-import-resolver' // [!code ++]

export default defineConfig(({ mode }) => {
  return {
    // ..
    plugins: [vue(), vueJsx(), Components({ resolvers: [VantResolver()] })], // [!code ++]
  }
})
```

这样就完成了 Vant 的按需引入，就可以直接在模板中使用 Vant 组件了，`unplugin-vue-components`会解析模板并自动注册对应的组件，`@vant/auto-import-resolver`会自动引入对应的组件样式

## 搭配React

```sh
pnpm create vite
```

![](./assets/vite/vite-react.png)

::: tip
通过上述交互式命令的选项，我们创建了一个带有 ESLint 的基于 Vite 脚手架的 React 项目
:::

EditorConfig [参考上面的配置](#配置editorconfig)

### 补充ESLint插件

```sh
pnpm add -D eslint-plugin-react
```

### 安装Prettier

`ESLint`和`Prettier`的忽略文件[参考上面的配置](#eslint和prettier的忽略文件)

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

新建`.prettierrc`文件，填入自己喜欢的配置

::: code-group

```sh
touch .prettierrc
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

:::

在`.eslintrc.js`中集成`prettier`

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}
```

### TailwindCSS

[参考上面的配置](#安装tailwindcss)

只是 CSS 的引入变成了`src/index.css`

```css
@tailwind base; // [!code ++]
@tailwind components; // [!code ++]
@tailwind utilities; // [!code ++]
```

环境变量也是[参考上面的配置](#配置环境变量)

### 引入`react-vant`

```sh
pnpm add react-vant @react-vant/icons
```

## 移动端适配

安装所需依赖，此插件的参数配置文档[看这里](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin#readme)

```sh
pnpm add -D postcss-px-to-viewport-8-plugin
```

::: warning ⚡
由于`Vant`使用的设计稿宽度是`375`，而通常情况下，设计师使用的设计稿宽度更多是`750`，那么`Vant`组件在`750`设计稿下会出现样式缩小的问题

解决方案: 当读取的`node_modules`文件是`vant`时，那么就将设计稿宽度变为`375`，读取的文件不是`vant`时，就将设计稿宽度变为`750`
:::

- 方式一：编辑`postcss.config.js`，增加如下`postcss-px-to-viewport-8-plugin`配置项

```js{6-13}
import path from 'path' // [!code ++]

export default {
  plugins: {
    // ...
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: (file) => {
        return path.resolve(file).includes(path.join('node_modules', 'vant')) ? 375 : 750
      },
      unitPrecision: 6,
      landscapeWidth: 1024,
      // exclude: [/node_modules\/vant/i]
    },
  },
}
```

- 方式二：编辑`vite.config.ts`，增加如下`css`配置项

```ts{8-21}
// ...
import path from 'path' // [!code ++]
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin' // [!code ++]

export default defineConfig(({ mode }) => {
  return {
    // ...
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport8plugin({
            viewportWidth: (file) => {
              return path.resolve(file).includes(path.join('node_modules', 'vant')) ? 375 : 750
            },
            unitPrecision: 6,
            landscapeWidth: 1024
            // exclude: [/node_modules\/vant/i]
          })
        ]
      }
    }
  }
})
```
