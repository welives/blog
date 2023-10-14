---
title: Vant搭建
---

::: tip 目标
搭建一个 Vant + TailwindCSS + TypeScript + Vite + ESLint + Prettier 的工程
:::

相关文档

- [Vant](https://vant-ui.github.io/vant/#/zh-CN)
- [TypeScript](https://www.tslang.cn/)
- [Vite](https://cn.vitejs.dev/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 初始化项目

使用 Vue 的官方脚手架进行初始化

::: code-group

```sh [pnpm]
pnpm create vue
```

```sh [yarn]
yarn create vue
```

:::

![初始化](../assets/vant/vue脚手架创建项目.png)

然后按照提示操作即可，这样一个基础项目就创建好了

## 安装Vant

```sh
pnpm add vant
```

### 给Vant配置按需引入

- 安装依赖

```sh
pnpm add -D @vant/auto-import-resolver unplugin-vue-components
```

修改`vite.config.js`

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite' // [!code ++]
import { VantResolver } from '@vant/auto-import-resolver' // [!code ++]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), Components({ resolvers: [VantResolver()] })], // [!code hl]
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

这样就完成了 Vant 的按需引入，就可以直接在模板中使用 Vant 组件了，`unplugin-vue-components`会解析模板并自动注册对应的组件，`@vant/auto-import-resolver`会自动引入对应的组件样式

## 安装TailwindCSS

安装依赖

```sh
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

修改`tailwind.config.js`

```js{2-7,9,11-13}
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors
    },
    extend: {}
  },
  plugins: []
}
```

修改`/src/assets/main.css`

```css
@tailwind base; // [!code ++]
@tailwind components; // [!code ++]
@tailwind utilities; // [!code ++]
```

到这里整个基础项目模板就搭建完成了
