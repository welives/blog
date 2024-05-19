---
title: UmiJS工程搭建
head:
  - - meta
    - name: description
      content: UmiJS工程搭建
  - - meta
    - name: keywords
      content: umijs typescript AntDesign react pnpm 工程化
---

::: tip ✨
搭建一个开箱即用的基于 UmiJS + AntDesign + TailwindCSS + TypeScript 的工程

UI框架以`Ant-Design`为例

[本工程的Github地址](https://github.com/welives/umijs-starter)

编写此笔记时所使用的`UmiJS`版本为`4.0.87`
:::

## 相关文档

- [UmiJS](https://umijs.org/)
- [AntDesign](https://ant-design.antgroup.com/index-cn)
- [TailwindCSS](https://www.tailwindcss.cn/)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 初始化项目

```sh
mkdir umi-starter && cd umi-starter
pnpm dlx create-umi@latest
```

![](./assets/umi/create-react.png)

初始化完毕后再安装一个`cross-env`用来兼容在不同的操作系统中使用环境变量

```sh
pnpm add -D cross-env
```

::: tip 🎉
这样就创建好一个以`UmiJS`为脚手架的基础工程了，接下来我们对它做亿点点额外的配置
:::

### 配置EditorConfig

新建`.editorconfig`，设置编辑器和 IDE 规范，内容根据自己的喜好或者团队规范

```ini
# http://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

### 配置ESLint

#### Umi的方案

详细文档[看这里](https://umijs.org/docs/guides/lint)

::: code-group

```sh [terminal]
pnpm add -D @umijs/lint eslint stylelint
touch .eslintrc.js
touch .eslintignore
touch .stylelintrc.js
```

```js [.eslintrc.js]
module.exports = {
  extends: require.resolve('umi/eslint'),
  rules: {
    complexity: ['error', 10],
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
.umi
.umi-production
```

```js [.stylelintrc.js]
module.exports = {
  extends: require.resolve('umi/stylelint'),
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply'],
      },
    ],
  },
}
```

```json [package.json]
{
  "scripts": {
    // ...
    "lint": "umi lint" // [!code ++]
  }
}
```

:::

#### 社区方案

如果你想用其他的社区方案的话，这里推荐使用[Nuxt团队的Anthony Fu大佬的eslint-config](https://github.com/antfu/eslint-config)

```sh
pnpm dlx @antfu/eslint-config@latest
```

![](./assets/umi/eslint-config.png)

编辑`eslint.config.mjs`

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**', '.umi', '**/.umi/**'],
  formatters: true,
  typescript: true,
  react: true,
})
```

编辑`package.json`，添加如下内容

```json
{
  // ...
  "scripts": {
    // ...
    "lint": "eslint .", // [!code ++]
    "lint:fix": "eslint . --fix" // [!code ++]
  }
}
```

### 配置Prettier

官方脚手架有快速生成`Prettier`配置的指令，详细的文档[看这里](https://umijs.org/docs/guides/generator#prettier-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8)

::: tip ⚡提示
`prettier-plugin-organize-imports`这个插件的作用是**自动移除没有被使用的`import`**，如果不想要这个功能就在`plugins`字段中移除
:::

::: code-group

```sh [terminal]
pnpm umi g prettier
```

```json [.prettierrc]
{
  "printWidth": 120,
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5",
  "proseWrap": "never",
  "overrides": [{ "files": ".prettierrc", "options": { "parser": "json" } }],
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-packagejson"]
}
```

```txt [.prettierignore]
node_modules
.umi
.umi-production
.DS_Store
dist
.idea
.vscode
```

:::

::: warning ⚡注意
如果你的`ESLint`配置使用的是上述社区方案，并且又想同时使用`prettier`的话，需要编辑`.vscode/settings.json`，把`prettier`启用。因为 **Anthony Fu** 大佬的这套`eslint-config`默认禁用`prettier`

```json
{
  "prettier.enable": true // [!code hl]
  // ...
}
```

:::

## 安装TailwindCSS

官方脚手架有快速生成`TailwindCSS`配置的指令，详细的文档[看这里](https://umijs.org/docs/guides/generator#tailwind-css-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8)

::: code-group

```sh [terminal]
pnpm umi g tailwindcss
```

```js [tailwind.config.js]
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{jsx,tsx}',
    './src/components/**/*.{jsx,tsx}',
    './src/layouts/**/*.{jsx,tsx}',
  ],
  corePlugins: {
    preflight: true,
  },
  plugins: [],
}
```

```css [tailwind.css]
@tailwind base;
@tailwind components;
@tailwind utilities;
```

:::

## 助手函数

新建`src/utils/utils.ts`，封装一些辅助函数，具体代码参考我的[助手函数封装](../encapsulation.md#helper)

## 插件

由于普通的 Umi 应用中，默认不附带任何插件，所以我们需要先安装它

```sh
pnpm add -D @umijs/plugins
```

关于 Umi 插件的详细文档[看这里](https://umijs.org/docs/guides/use-plugins)，Umi 的官方插件列表[看这里](https://github.com/umijs/plugins)

## 数据流插件

为了拥有良好的开发体验，以`hooks`范式使用和管理全局状态，我们需要启用`@umijs/plugin-model`插件

编辑`.umirc.ts`或者`config/config.ts`文件

```ts
export default defineConfig({
  // ...
  plugins: [
    // ...
    '@umijs/plugins/dist/model', // [!code ++]
  ],
  model: {}, // [!code ++]
})
```

### 示例

数据流插件要求在`src`目录下创建一个`models`目录，该目录下存放需要全局共享的数据

::: code-group

```sh [terminal]
mkdir src/models
touch src/models/count.ts
```

```ts [count.ts]
import { useCallback, useState } from 'react'

export default () => {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => setCounter((c) => c + 1), [])
  const decrement = useCallback(() => setCounter((c) => c - 1), [])

  return { counter, increment, decrement }
}
```

:::

然后编辑`src/pages/index.tsx`和`src/pages/docs.tsx`

::: code-group

```tsx [index.tsx]
import { useModel } from 'umi'

export default function HomePage() {
  const { counter, increment, decrement } = useModel('count')
  return (
    <div>
      <button onClick={decrement}>minus</button>
      <span className="mx-3">{counter}</span>
      <button onClick={increment}>plus</button>
    </div>
  )
}
```

```tsx [docs.tsx]
import { useModel } from 'umi'

export default function DocsPage() {
  const { counter, increment, decrement } = useModel('count')
  return (
    <div>
      <button onClick={decrement}>minus</button>
      <span className="mx-3">{counter}</span>
      <button onClick={increment}>plus</button>
    </div>
  )
}
```

:::

启动项目查看这个计数器例子，可以看到在`HomePage`页面中修改了`counter`的值后，`DocsPage`页面中也会跟着改变

## 请求插件

编辑`.umirc.ts`或`config/config.ts`

```ts
export default defineConfig({
  plugins: [
    // ...
    '@umijs/plugins/dist/request', // [!code ++]
  ],
  request: {}, // [!code ++]
})
```

新建`src/app.tsx`，编写如下请求配置

::: details 查看

```tsx
import type { AxiosRequestConfig, AxiosResponse, RequestConfig } from 'umi'

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure<T = any> {
  success: boolean
  code: string
  data?: T
  message?: string
  [key: string]: any
}

export const request: RequestConfig = {
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res
      if (!success) {
        const error: any = new Error(errorMessage)
        error.name = 'BizError'
        error.info = { errorCode, errorMessage, showType, data }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts) => {
      if (opts?.skipErrorHandler) throw error
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break
            case ErrorShowType.WARN_MESSAGE:
              // TODO: message
              console.warn(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              // TODO: message
              console.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              // TODO: notification
              console.error({ description: errorMessage, message: errorCode })
              break
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break
            default:
              // TODO: message
              console.error(errorMessage)
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // TODO: message
        console.error(`Response status:${error.response.status}`)
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // error.request 在浏览器中是 XMLHttpRequest 的实例
        // 而在node.js中是 http.ClientRequest 的实例
        // TODO: message
        console.error('None response! Please retry.')
      } else {
        // 发送请求时出了点问题
        // TODO: message
        console.error('Request error, please retry')
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    [
      (config: AxiosRequestConfig) => {
        // 拦截请求配置，进行个性化处理。
        return { ...config }
      },
      (error) => {
        return Promise.reject(error)
      },
    ],
  ],
  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response
      if (!data.success) {
        // TODO: message
        console.error('请求失败！')
      }
      return response
    },
  ],
}
```

:::

### Mock

根目录新建`mock/index.ts`，示例如下，根据自己的情况添加添加接口

```ts
export default {
  'POST /api/login': {
    code: '200',
    message: 'ok',
    data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs',
    success: true,
  },
}
```

使用

```tsx
import { request } from 'umi'
request('/api/login', { method: 'POST' })
```

## UI框架

### 使用Ant-Design

```sh
pnpm add antd @ant-design/icons
```

编辑`.umirc.ts`或`config/config.ts`

```ts
export default defineConfig({
  plugins: [
    // ...
    '@umijs/plugins/dist/antd', // [!code ++]
  ],
  antd: {}, // [!code ++]
})
```

新建`src/global.tsx`，引入样式

```ts
import 'antd/dist/reset.css'
```

#### 布局

先编辑`.umirc.ts`或`config/config.ts`，启用内置布局插件，并为每个路由新增`name`字段，用于给`ProLayout`做菜单渲染使用

```ts
export default defineConfig({
  routes: [
    { path: '/', component: 'index', name: 'Home' },
    { path: '/docs', component: 'docs', name: 'Docs' },
  ],
  plugins: [
    // ...
    '@umijs/plugins/dist/layout', // [!code ++]
  ],
  layout: {
    title: 'UmiJS Starter', // [!code ++]
  },
})
```

接着编辑`src/app.tsx`，添加如下内容

```tsx
import type { RunTimeLayoutConfig } from 'umi'
// 更多参数见: https://procomponents.ant.design/components/layout#prolayout
export const layout: RunTimeLayoutConfig = () => {
  return {
    layout: 'mix',
  }
}
```

### 使用React-Vant

```sh
pnpm add react react-dom react-vant @react-vant/icons
```

#### 移动端适配

```sh
pnpm add -D postcss-px-to-viewport-8-plugin
```

编辑`.umirc.ts`或`config/config.ts`，增加如下`extraPostCSSPlugins`配置项

```ts
import path from 'path' // [!code ++]
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin' // [!code ++]
export default defineConfig({
  // ... // [!code focus:10]
  extraPostCSSPlugins: [
    postcsspxtoviewport8plugin({
      viewportWidth: (file: string) => {
        return path.resolve(file).includes(path.join('node_modules', 'react-vant')) ? 375 : 750
      },
      unitPrecision: 6,
      landscapeWidth: 1024,
    }),
  ],
})
```

## 在Umi中使用Vue

在 Umi 中使用 Vue 的初始化方式和 React 类似，接下来我只会讲不一样的地方

![](./assets/umi/create-vue.png)

由于 StyleLint 对 Vue 的支持不太友好，所以编码规范插件装 ESLint 和 Prettier 就行

### JSX支持

编辑`tsconfig.json`

```json
{
  // ...
  "compilerOptions": {
    "jsxImportSource": "vue" // [!code ++]
  }
}
```

### 配置TailwindCSS

在 Umi 中使用 Vue 默认是同时支持模板语法和 JSX 语法的，所以修改一下`TailwindCSS`的配置

```js{3-5}
module.exports = {
  content: [
    './src/pages/**/*.{jsx,tsx,vue}', // [!code focus]
    './src/components/**/*.{jsx,tsx,vue}', // [!code focus]
    './src/layouts/**/*.{jsx,tsx,vue}', // [!code focus]
  ],
}
```

### 状态管理

由于 Umi 的`useModel`只支持 React，所以需要使用`Pinia`代替

```sh
pnpm add pinia pinia-plugin-persistedstate
```

接着新建`src/app.tsx`，写入如下内容，之后就可以像正常的 Vue 项目一样使用`pinia`了

```tsx
import { createPinia } from 'pinia'

export function onAppCreated({ app }: any) {
  app.use(createPinia().use(piniaPluginPersistedstate))
}
```

#### 持久化

新建`src/utils/storage.ts`和`src/stores/user.ts`

::: code-group

```ts [storage.ts]
enum StorageSceneKey {
  USER = 'storage-user',
}
function getItem<T = any>(key: string): T {
  const value: any = localStorage.getItem(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
function removeItem(key: string) {
  localStorage.removeItem(key)
}
export { StorageSceneKey, getItem, removeItem, setItem }
```

```ts [user.ts]
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StorageSceneKey } from '../utils'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const isLogged = ref(false)
    const setToken = (value: string) => {
      token.value = value
      isLogged.value = true
    }
    const removeToken = () => {
      token.value = ''
      isLogged.value = false
    }
    return { token, isLogged, setToken, removeToken }
  },
  {
    persist: {
      //! 注意这里的key是当前这个Pinia模块进行缓存时的唯一key, 每个需要缓存的Pinia模块都必须分配一个唯一key
      key: StorageSceneKey.USER,
    },
  }
)
```

:::

### Ant-Design-Vue

```sh
pnpm add ant-design-vue @ant-design/icons-vue
```

新建`src/global.ts`，引入样式

```ts
import 'ant-design-vue/dist/reset.css'
```
