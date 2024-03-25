---
title: 给VitePress增加代码演示功能
head:
  - - meta
    - name: description
      content: 给VitePress增加代码演示功能
  - - meta
    - name: keywords
      content: vitepress code preview demo plugin 插件
---

::: tip ⚡
VitePress 默认的代码演示功能用起来有点繁琐，所以我自己开发了一个插件来更简单的使用这个功能，并且已经发布到 npm

[项目地址](https://github.com/welives/vitepress-code-preview)
:::

## 🏄‍♂️ 插件包

| Package                           | Version                                                                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| @vitepress-code-preview/container | [![container version](https://badgen.net/npm/v/@vitepress-code-preview/container)](https://www.npmjs.com/package/@vitepress-code-preview/container) |
| @vitepress-code-preview/plugin    | [![plugin version](https://badgen.net/npm/v/@vitepress-code-preview/plugin)](https://www.npmjs.com/package/@vitepress-code-preview/plugin)          |

## ⚙ 安装

```sh
pnpm add @vitepress-code-preview/container @vitepress-code-preview/plugin
```

## 🚀 引入

- ① 编辑 `docs/vite.config.ts`，注册 Vite 插件，如果需要支持 JSX 组件，请安装 `@vitejs/plugin-vue-jsx`

```ts
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
export default defineConfig({
  plugins: [viteDemoPreviewPlugin(), vueJsx()],
})
```

- ② 编辑 `docs/.vitepress/config.ts`，注册 markdown 插件

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

export default defineConfig({
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
})
```

- ③ 编辑 `docs/.vitepress/theme/index.ts`，注册组件容器

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    useComponents(ctx.app, DemoPreview)
  },
} satisfies Theme
```
