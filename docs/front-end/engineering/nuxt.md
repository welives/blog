---
title: Nuxt工程搭建
head:
  - - meta
    - name: description
      content: Nuxt工程搭建
  - - meta
    - name: keywords
      content: nuxt nuxt.js typescript vue3 pnpm 工程化
---

::: tip ✨
搭建一个开箱即用的基于 Nuxt3 + Pinia + TailwindCSS + TypeScript 的工程

[本工程的Github地址](https://github.com/welives/nuxt-starter)

编写此笔记时所使用的`Nuxt.js`版本为`3.11.2`
:::

## 相关文档

- [Nuxt.js](https://nuxt.com.cn/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- [NuxtUI](https://ui.nuxt.com/)
- [Shadcn-vue](https://github.com/radix-vue/shadcn-vue)
- [Vant](https://vant-ui.github.io/vant/#/zh-CN)
- [Iconify](https://iconify.design/)
- [TailwindCSS](https://www.tailwindcss.cn/)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 项目初始化

```sh
pnpm dlx nuxi init
```

:::danger 🥧一步到胃
**如果你不想尝试一次手动搭建基础模板的过程，那么也可以直接食用[Nuxt团队的Anthony Fu大佬的模板](https://github.com/antfu-collective/vitesse-nuxt3)**
:::

### 配置EditorConfig

根目录新建`.editorconfig`，填入如下内容

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

### 配置ESLint和Prettier

::: warning ⚡ 注意
由于 Nuxt 的官方初始模板缺少了`ESLint`和`Prettier`等配置，所以需要自己手动安装
:::

::: details ~~这个方案废弃，因为有大佬做了个整合插件，看下面~~

- **ESLint**

```sh
npx eslint --init
```

选第二个

![](./assets/nuxt/eslint_setup_1.png)

选第一个

![](./assets/nuxt/eslint_setup_2.png)

选 Vue

![](./assets/nuxt/eslint_setup_3.png)

选`TypeScript`，然后运行环境按`a`全选

![](./assets/nuxt/eslint_setup_4.png)

`ESLint`配置文件的的保存格式，选第一个

![](./assets/nuxt/eslint_setup_5.png)

是否立即安装所需的依赖，选 Yes

![](./assets/nuxt/eslint_setup_6.png)

这里根据项目构建所使用的包管理器进行选择，因为本项目使用`pnpm`，所以选第三个

![](./assets/nuxt/eslint_setup_7.png)

- **Prettier**

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

根目录新建`.prettierrc`文件，填入自己喜欢的配置

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

- **ESLint和Prettier的忽略文件**

根目录新建`.eslintignore`和`.prettierignore`文件，填入自己喜欢的配置

```
.DS_Store
node_modules
dist
.idea
.vscode
.nuxt
```

- **在`.eslintrc.js`中集成Prettier**

```js
module.exports = {
  // ...
  extends: [
    // ...
    'prettier', // [!code ++]
    'plugin:prettier/recommended', // [!code ++]
  ],
  parser: 'vue-eslint-parser', // [!code ++]
  plugins: ['@typescript-eslint', 'vue', 'prettier'], // [!code ++]
  rules: {
    complexity: ['error', 10], // [!code ++]
    'prettier/prettier': 'error', // [!code ++]
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // [!code ++]
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // [!code ++]
    // ...
  },
}
```

:::

:::: tip ✨新方案，直接使用[Nuxt团队的Anthony Fu大佬的eslint-config](https://github.com/antfu/eslint-config)

```sh
pnpm dlx @antfu/eslint-config@latest
```

![](./assets/nuxt/eslint-config.png)

编辑`eslint.config.js`和`nuxt.config.ts`

::: code-group

```js [eslint.config.js]
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    ignores: [
      'node_modules',
      '**/node_modules/**',
      'dist',
      '**/dist/**',
      '.nuxt',
      '**/.nuxt/**',
      '.output',
      '**/.output/**',
    ],
    formatters: true,
    typescript: true,
    vue: true,
  })
)
```

```ts{4-8} [nuxt.config.ts]
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'], // [!code ++]
  eslint: {
    config: {
      standalone: false, // [!code ++]
    },
  },
})
```

:::

由于 **Anthony Fu** 大佬的这套`eslint-config`默认禁用`prettier`，如果你想配合`prettier`一起用的话就安装它(_不用的话就跳过_)，然后在根目录新建`.prettierrc`，填入自己喜欢的配置

::: code-group

```sh [terminal]
pnpm add -D prettier
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

接着编辑`.vscode/settings.json`，把`prettier`启用即可

```json
{
  "prettier.enable": true // [!code hl]
  // ...
}
```

::::

### TypeScript检查

```sh
pnpm add -D typescript vue-tsc
```

编辑`package.json`

```json
{
  "scripts": {
    // ...
    "typecheck": "vue-tsc --noEmit" // [!code ++]
  }
}
```

## 环境变量

关于 Nuxt3 的环境变量详细文档[看这里](https://nuxt.com.cn/docs/getting-started/configuration#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%92%8C%E7%A7%81%E6%9C%89%E4%BB%A4%E7%89%8C)

Nuxt 在运行或者打包生产环境时都是使用`dotenv`来加载`.env`文件中的环境变量的

新建`.env`文件，填入项目所需的环境变量。注意，环境变量名必须以`NUXT_`开头，否则不会被识别，例如

```ini
NUXT_APP_NAME=nuxt-starter
NUXT_APP_HOST=localhost
NUXT_APP_PORT=3000
NUXT_API_SECRET=secret_string
```

### 使用

- 在`nuxt.config.ts`中可以通过`runtimeConfig`配置项透传环境变量到应用中

`runtimeConfig`配置项中的`app`和`public`变量被暴露到客户端中，而与它们**平级**的其他变量则只会在服务端可用

```ts{3-11}
export default defineNuxtConfig({
  // ...
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    app: {
      appName: process.env.NUXT_APP_NAME,
    },
    public: {
      appName: process.env.NUXT_APP_NAME,
    },
  },
})
```

- 在`nuxt.config.ts`中可以通过`appConfig`配置项透传环境变量到应用中

注意，这种方式透传的所有变量都会暴露到客户端中，所以不要把敏感信息放到这里

```ts{3-6}
export default defineNuxtConfig({
  // ...
  appConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    appName: process.env.NUXT_APP_NAME,
  },
})
```

- 在`app.config.ts`文件中定义全局变量

Nuxt3 会把`nuxt.config.ts`中的`appConfig`配置项合并到`app.config.ts`中，且这里的变量可以在应用的运行生命周期内进行动态更新

::: code-group

```ts{2-4} [app.config.ts]
export default defineAppConfig({
  haha: 'i am defined in app.config.ts',
  apiSecret: undefined,
  appName: 'what is this app',
})
```

```ts{3-7} [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  appConfig: {
    test: 'pass from nuxt.config.ts',
    apiSecret: process.env.NUXT_API_SECRET,
    appName: process.env.NUXT_APP_NAME,
  },
})
```

:::

![](./assets/nuxt/打印appConfig.png)

::: warning ⚡注意
这个文件有点特别，在这里无法读取到环境变量的值，但可以在这里定义一些有明确初始值的变量。这个文件的作用更像是预先定义一些占位的变量，等待`nuxt.config.ts`中的`appConfig`合并到此，然后在应用运行生命周期内进行修改
:::

## Color-mode

```sh
pnpm add -D @nuxtjs/color-mode
```

编辑`nuxt.config.ts`，注册`@nuxtjs/color-mode`模块

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@nuxtjs/color-mode', // [!code ++]
  ],
})
```

## Vueuse

```sh
pnpm add -D @vueuse/nuxt
```

编辑`nuxt.config.ts`，注册`@vueuse/nuxt`模块

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@vueuse/nuxt', // [!code ++]
  ],
})
```

## PWA

```sh
pnpm add -D @vite-pwa/nuxt
```

编辑`nuxt.config.ts`，注册`@vite-pwa/nuxt`模块

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@vite-pwa/nuxt', // [!code ++]
  ],
})
```

## 状态管理

```sh
pnpm add -D pinia @pinia/nuxt
```

编辑`nuxt.config.ts`，注册`@pinia/nuxt`模块并设置自动导入，同时指定`stores`目录

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    ['@pinia/nuxt', { autoImports: ['defineStore'] }], // [!code ++]
  ],
  imports: { dirs: ['./stores'] }, // [!code ++]
})
```

### 持久化

```sh
pnpm add -D @pinia-plugin-persistedstate/nuxt
```

编辑`nuxt.config.ts`，注册`@pinia-plugin-persistedstate/nuxt`模块

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@pinia-plugin-persistedstate/nuxt', // [!code ++]
  ],
})
```

## TailwindCSS

```sh
pnpm add -D @nuxtjs/tailwindcss
```

编辑`nuxt.config.ts`，注册`@nuxtjs/tailwindcss`模块

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@nuxtjs/tailwindcss', // [!code ++]
  ],
})
```

虽然官方文档说这样就行了，`assets/css/tailwind.css`和`tailwind.config.js`这两个文件会在执行`npm run dev`后自动生成到`.nuxt`目录中

但是...在实际使用过程肯定会需要给 TailwindCSS 扩展点内容的，而根据配置文件功能尽量单一的原则，还是建议手动创建这两个文件

- **初始化 TailwindCSS**

```sh
pnpm dlx tailwindcss init
```

在根目录新建`assets/css/tailwind.css`文件，如果缺少相应的文件夹则顺便创建一下，填入如下内容

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

编辑`tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,jsx,tsx}',
    './layouts/**/*.{vue,jsx,tsx}',
    './pages/**/*.{vue,jsx,tsx}',
    './stores/**/*.{js,ts}',
    './app.{vue,jsx,tsx}',
    './nuxt.config.{js,ts}',
  ],
  corePlugins: {
    preflight: true,
  },
  plugins: [],
}
```

### 类排序插件

```sh
pnpm add -D prettier prettier-plugin-tailwindcss
```

编辑`.prettierrc`，注册插件

```json
{
  "plugins": ["prettier-plugin-tailwindcss"] // [!code ++]
}
```

### debug插件

```sh
pnpm add -D tailwindcss-debug-screens
```

编辑`tailwind.config.js`，注册插件

```js{5-8}
/** @type {import('tailwindcss').Config} */
export default {
  // ...
  theme: {
    debugScreens: {
      position: ['bottom', 'right'],
      ignore: ['dark'],
    },
  },
  plugins: [
    process.env.NODE_ENV === 'development' && require('tailwindcss-debug-screens'), // [!code ++]
  ],
}
```

### 设置字体

编辑`tailwind.config.js`

```js
const { fontFamily } = require('tailwindcss/defaultTheme') // [!code ++]
/** @type {import('tailwindcss').Config} */
export default {
  // ...
  theme: {
    // ...
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', ...fontFamily.sans], // [!code ++]
      },
    },
  },
}
```

## Iconify图标

这里以`tailwind`使用`lucide`图标集为例

```sh
pnpm add -D @iconify/tailwind @iconify-json/lucide
```

编辑`tailwind.config.js`，注册插件

```js
/** @type {import('tailwindcss').Config} */
export default {
  // ...
  plugins: [
    // ...
    require('@iconify/tailwind').addDynamicIconSelectors(), // [!code ++]
  ],
}
```

在页面中的使用方式有如下两种

```vue
<template>
  <span class="icon-[lucide--contrast]"></span>
  <span class="i-lucide-contrast"></span>
</template>
```

封装成组件的话，可以参考如下

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../libs'
interface Props {
  name: string
  class?: HTMLAttributes['class']
}
defineOptions({
  name: 'Iconify',
})
const props = withDefaults(defineProps<Props>(), {
  class: 'w-5 h-5',
})
</script>

<template>
  <span :class="cn(props.name, props.class)"></span>
</template>
```

## UI框架

### 使用NuxtUI

```sh
pnpm add -D @nuxt/ui
```

编辑`nuxt.config.ts`，注册`@nuxt/ui`模块。由于`@nuxt/ui`内置且自动加载`@nuxtjs/tailwindcss`和`@nuxtjs/color-mode`模块，所以这两个可以移除掉了

```ts{6-9}
export default defineNuxtConfig({
  modules: [
    // ...
    '@nuxt/ui', // [!code ++]
    '@nuxtjs/tailwindcss', // [!code --]
    '@nuxtjs/color-mode', // [!code --]
  ],
})
```

### 使用Shadcn

由于`Shadcn`和`TailwindCSS`是绑定在一起的，所以请务必先安装[TailwindCSS](#tailwindcss)

```sh
pnpm add -D shadcn-nuxt
```

编辑`nuxt.config.ts`，注册`shadcn-nuxt`模块

```ts{6-9}
export default defineNuxtConfig({
  modules: [
    // ...
    'shadcn-nuxt', // [!code ++]
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
})
```

接着执行命令初始化`Shadcn-vue`

```sh
pnpm dlx shadcn-vue@latest init
```

![](./assets/nuxt/install-shadcn-vue.png)

### 使用Vant

```sh
pnpm add -D vant @vant/nuxt
```

编辑`nuxt.config.ts`，注册`@vant/nuxt`模块并设置懒加载

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@vant/nuxt', // [!code ++]
  ],
  vant: { lazyload: true }, // [!code ++]
})
```

#### 移动端适配 {#mobile-adaptation}

安装所需依赖，此插件的参数配置文档[看这里](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin#readme)

```sh
pnpm add -D postcss-px-to-viewport-8-plugin
```

::: warning ⚡注意
由于`Vant`使用的设计稿宽度是`375`，而通常情况下，设计师使用的设计稿宽度更多是`750`，那么`Vant`组件在`750`设计稿下会出现样式缩小的问题

解决方案: 当读取的`node_modules`文件是`vant`时，那么就将设计稿宽度变为`375`，读取的文件不是`vant`时，就将设计稿宽度变为`750`
:::

编辑`nuxt.config.ts`文件，增加如下`postcss`配置项

```ts
import path from 'path' // [!code ++]
export default defineNuxtConfig({
  // ... // [!code focus:12]
  postcss: {
    plugins: {
      'postcss-px-to-viewport-8-plugin': {
        viewportWidth: (file: string) => {
          return path.resolve(file).includes(path.join('node_modules', 'vant')) ? 375 : 750
        },
        unitPrecision: 6,
        landscapeWidth: 1024,
      },
    },
  },
})
```

::: tip 🔔
如果通过`exclude: [/node_modules\/vant/i]`直接忽略`Vant`的话，那么`viewportWidth`则可以直接给个固定的值而不是传入函数进行处理
:::

## Docker本地部署

项目根目录新建`Dockerfile`、`docker-compose.yml`、`.dockerignore`和`nginx.conf`，具体内容参考如下

::: code-group

```Dockerfile
# 阶段一：构建应用
#
# 使用官方Node.js 20镜像作为构建环境
FROM node:20 as build-stage
# 设置工作目录为/app
WORKDIR /app
# 复制项目的package.json和package-lock到工作目录
COPY package.json package-lock.* ./
# 安装项目依赖，使用中国镜像加速
RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm install --registry=https://registry.npmmirror.com
# 复制项目所有文件到工作目录
COPY . .
# 构建项目
RUN pnpm run build && pnpm run generate

# 阶段二：构建Nginx镜像部署阶段一的产物
#
# 使用官方nginx:latest镜像作为构建环境
FROM nginx:latest as deploy-stage
# 删除ngnix的默认页面
RUN rm -rf /usr/share/nginx/html/*
# 删除nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 复制自定义nginx配置到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将阶段一构建产物复制到nginx的服务目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 暴露80端口
EXPOSE 80
# 将nginx转为前台进程
CMD ["nginx", "-g", "daemon off;"]
```

```yml [docker-compose.yml]
version: '3.8'
services:
  web_app: #服务名
    build: # 使用Dockerfile构建镜像
      context: . # 指定 Dockerfile 所在目录
      dockerfile: Dockerfile # 指定 Dockerfile 文件名
    image: nuxt-app # 镜像名称
    container_name: nuxt-app # 容器名称
    restart: always # 自动重启
    ports:
      - 5000:80
```

```txt [.dockerignore]
node_modules
dist
.git
.nuxt
.output
README.md
```

```nginx [nginx.conf]
server {
    listen 80;
    # 设置服务器名称，本地部署时使用localhost
    server_name localhost;
    # 设置网站根目录位置
    root /usr/share/nginx/html;
    # 网站首页
    index index.html index.htm;

    error_page 404 /404.html;
    location / {
        # 设置HTTP头部，禁用缓存策略
        add_header Cache-Control no-cache;
        try_files $uri $uri/ /index.html;
    }
}
```

:::

### docker-compose一键部署

```sh
docker-compose up --build -d
```

在宿主机浏览器中访问`http://localhost:5000`
