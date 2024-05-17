---
title: Vite工程搭建
head:
  - - meta
    - name: description
      content: Vite工程搭建
  - - meta
    - name: keywords
      content: vite typescript vue3 pinia pinia-plugin-persistedstate 持久化 mock react pnpm 工程化
---

::: tip ✨
搭建一个开箱即用的基于 Vite + Pinia + Vant + TailwindCSS + TypeScript 的工程

UI框架以 Vant 为例

[本工程的Github地址](https://github.com/welives/vite-starter)

编写此笔记时所使用的`Vite`版本为`4.4.9`
:::

## 相关文档

- [Vite](https://cn.vitejs.dev/)
- [Vue](https://cn.vuejs.org/guide/introduction.html)
- [Pinia](https://pinia.vuejs.org/zh/)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- [Vant](https://vant-ui.github.io/vant/#/zh-CN)
- [TailwindCSS](https://www.tailwindcss.cn/)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 初始化项目

```sh
pnpm create vue
```

![初始化](./assets/vite/vite-vue.png)

按照提示操作即可，这样一个基础项目就创建好了

::: tip 💡
通过上述交互式命令的选项，我们创建了一个带有`vue-router`、`pinia`、`ESLint`和`Prettier`的基于 Vite 脚手架的 Vue 项目
:::

:::danger 🥧一步到胃
**如果你不想尝试一次手动搭建基础模板的过程，那么也可以直接食用[Nuxt团队的Anthony Fu大佬的模板](https://github.com/antfu-collective/vitesse)**
:::

### 配置EditorConfig

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

### 配置ESLint和Prettier

脚手架预设的`ESLint`还不够完善，这里直接使用[Nuxt团队的Anthony Fu大佬的eslint-config](https://github.com/antfu/eslint-config)进行完善

```sh
pnpm dlx @antfu/eslint-config@latest
```

![](./assets/vite/eslint-config.png)

编辑`eslint.config.js`

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**'],
  formatters: true,
  typescript: true,
  vue: true,
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

## 安装TailwindCSS

安装依赖

```sh
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

编辑`tailwind.config.js`

```js
const colors = require('tailwindcss/colors')
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,jsx,tsx}'], // [!code focus]
  theme: {
    extend: { colors }, // [!code focus]
  },
  corePlugins: {
    preflight: false, // [!code focus]
  },
  plugins: [],
}
```

编辑`src/assets/main.css`，增加如下内容

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 环境变量

关于 Vite 的环境变量详细文档[看这里](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

新建`.env`文件，填入项目所需的环境变量。注意，环境变量名必须以`VITE_`开头，否则不会被识别，例如

```ini
VITE_APP_NAME=ts-vant-starter
VITE_APP_HOST=localhost
VITE_APP_PORT=5173
API_HOST=http://localhost
API_PORT=80
VITE_BASE_API=$API_HOST:$API_PORT
VITE_API_SECRET=secret_string
```

编辑`env.d.ts`，给自定义的环境变量添加类型

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_HOST: string
  readonly VITE_APP_PORT: string
  readonly VITE_BASE_API: string
  readonly VITE_API_SECRET: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 使用

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

## 自动导入

```sh
pnpm add -D unplugin-auto-import
```

编辑`vite.config.ts`，注册插件

```ts
import AutoImport from 'unplugin-auto-import/vite' // [!code ++]
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      // ... // [!code focus:9]
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'pinia', 'vue-router'],
        eslintrc: {
          enabled: true,
        },
        dts: true,
      }),
    ],
  }
})
```

编辑`tsconfig.app.json`，将插件生成的`auto-imports.d.ts`添加进`include`字段

```json
{
  "include": [
    // ...
    "auto-imports.d.ts" // [!code ++]
  ]
}
```

编辑`.eslintrc.js`，将插件生成的`.eslintrc-auto-import.json`添加进`extends`字段

```js
module.exports = {
  extends: [
    // ...
    './.eslintrc-auto-import.json', // [!code ++]
  ],
}
```

## 助手函数

新建`src/libs/utils.ts`，封装一些辅助函数，具体代码参考我的[助手函数封装](../encapsulation.md#helper)

## 请求模块

```sh
pnpm add axios
```

新建`src/api/core/http.ts`和`src/api/core/config.ts`，之后的封装逻辑参考我的[Axios封装](../encapsulation.md#axios)

### Mock

安装`2.9.8`的版本，`3`的版本目前有`bug`

```sh
pnpm add -D vite-plugin-mock@2.9.8 mockjs @types/mockjs
```

编辑`vite.config.ts`，注册插件

```ts
import { viteMockServe } from 'vite-plugin-mock' // [!code ++]
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      //...
      viteMockServe(), // [!code ++]
    ],
  }
})
```

根目录新建`mock/index.ts`，示例如下，根据自己的情况添加添加接口

```ts
import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/api/login',
    method: 'post',
    response: () => {
      return {
        code: '200',
        message: 'ok',
        data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs',
        success: true,
      }
    },
  },
] as MockMethod[]
```

- 使用

```ts
import { request } from './api'
request('/api/login', { method: 'POST' })
```

注意，`vite-plugin-mock`默认是以当前开发服务器的`host`和`post`作为`baseURL`

## 状态持久化

```sh
pnpm add pinia-plugin-persistedstate
```

编辑`src/main.ts`，注册插件

```ts
// ...
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // [!code ++]
const app = createApp(App)
app.use(createPinia().use(piniaPluginPersistedstate)).use(router).mount('#app') // [!code ++]
```

新建`src/libs/storage.ts`和`src/stores/user.ts`

::: code-group

```ts [storage.ts]
enum StorageSceneKey {
  USER = 'storage-user',
}
function getItem<T = any>(key: string): T {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
function removeItem(key: string) {
  localStorage.removeItem(key)
}
export { getItem, setItem, removeItem, StorageSceneKey }
```

```ts [user.ts]
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StorageSceneKey } from '../libs'
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

## UI框架

### 使用Vant

```sh
pnpm add vant
```

#### 按需引入

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
    plugins: [
      //...
      Components({ resolvers: [VantResolver()] }), // [!code ++]
    ],
  }
})
```

这样就完成了 Vant 的按需引入，就可以直接在模板中使用 Vant 组件了，`unplugin-vue-components`会解析模板并自动注册对应的组件，`@vant/auto-import-resolver`会自动引入对应的组件样式

#### 移动端适配

此插件的参数配置文档[看这里](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin#readme)

```sh
pnpm add -D postcss-px-to-viewport-8-plugin
```

::: warning ⚡
由于`Vant`使用的设计稿宽度是`375`，而通常情况下，设计师使用的设计稿宽度更多是`750`，那么`Vant`组件在`750`设计稿下会出现样式缩小的问题

解决方案: 当读取的`node_modules`文件是`vant`时，那么就将设计稿宽度变为`375`，读取的文件不是`vant`时，就将设计稿宽度变为`750`
:::

- 方式一：编辑`postcss.config.js`，增加如下`postcss-px-to-viewport-8-plugin`配置项

```js
import path from 'path' // [!code ++]
export default {
  plugins: {
    // [!code focus:8]
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: (file) => {
        return path.resolve(file).includes(path.join('node_modules', 'vant')) ? 375 : 750
      },
      unitPrecision: 6,
      landscapeWidth: 1024,
    },
  },
}
```

- 方式二：编辑`vite.config.ts`，增加如下`css`配置项

```ts
// ...
import path from 'path' // [!code ++]
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin' // [!code ++]
export default defineConfig(({ mode }) => {
  return {
    // [!code focus:14]
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport8plugin({
            viewportWidth: (file) => {
              return path.resolve(file).includes(path.join('node_modules', 'vant')) ? 375 : 750
            },
            unitPrecision: 6,
            landscapeWidth: 1024,
          }),
        ],
      },
    },
  }
})
```

::: tip 🎉
到这里，基于 Vite 的基础项目模板就搭建完成了
:::

## 搭配React

```sh
pnpm create vite
```

![](./assets/vite/vite-react.png)

::: tip 💡
通过上述交互式命令的选项，我们创建了一个带有 ESLint 的基于 Vite 脚手架的 React 项目
:::

EditorConfig [参考上面的配置](#配置editorconfig)

### ESLint和Prettier

```sh
pnpm dlx @antfu/eslint-config@latest
```

编辑`eslint.config.js`

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**'],
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

### TailwindCSS

[参考上面的配置](#安装tailwindcss)

只是 CSS 的引入变成了`src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

环境变量也是[参考上面的配置](#配置环境变量)

### 引入`react-vant`

```sh
pnpm add react-vant @react-vant/icons
```

### 状态管理

```sh
pnpm add zustand immer
```

#### 定义

新建`src/models/counter.ts`和`src/models/selectors.ts`

::: code-group

```ts [counter.ts]
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import createSelectors from './selectors'
interface State {
  count: number
}
interface Action {
  inc: () => void
  dec: () => void
}
const initialState: State = {
  count: 0,
}
const counterStore = create<State & Action>()(
  immer((set, get) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 })),
    dec: () => set((state) => ({ count: state.count - 1 })),
  }))
)
export const useCounterStore = createSelectors(counterStore)
export function useCounterReset() {
  counterStore.setState(initialState)
}
```

```ts [selectors.ts]
import { StoreApi, UseBoundStore } from 'zustand'
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never
const createSelectors = <S extends UseBoundStore<StoreApi<{}>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}
export default createSelectors
```

:::

#### 示例

```tsx
// ...
import { useCounterStore, useCounterReset } from './models'
function App() {
  const count = useCounterStore.use.count()
  const inc = useCounterStore.use.inc()
  return (
    <>
      <Button
        icon={<Like />}
        round
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        size="small"
        onClick={inc}
      >
        Like {count}
      </Button>
      <div className="card">
        <button onClick={useCounterReset}>Reset</button>
      </div>
    </>
  )
}
```

#### 持久化

新建`src/libs/storage.ts`和`src/models/user.ts`

::: code-group

```ts [storage.ts]
enum StorageSceneKey {
  USER = 'storage-user',
}
function getItem<T = any>(key: string): T {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
function removeItem(key: string) {
  localStorage.removeItem(key)
}
export { getItem, setItem, removeItem, StorageSceneKey }
```

```ts [user.ts]
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import createSelectors from './selectors'
import { StorageSceneKey } from '../libs'
interface State {
  token: string
  isLogged: boolean
}
interface Action {
  setToken: (token: string) => void
  removeToken: () => void
}
const userStorage: StateStorage = {
  getItem: (key) => {
    const value = localStorage.getItem(key)
    return value ?? null
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value)
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
  },
}
const initialState: State = {
  token: '',
  isLogged: false,
}
const userStore = create<State & Action>()(
  immer(
    persist(
      (set, get) => ({
        token: '',
        isLogged: false,
        setToken: (token) => set({ token, isLogged: true }),
        removeToken: () => set({ token: '', isLogged: false }),
      }),
      {
        //! 注意这里的name是当前这个Zustand模块进行缓存时的唯一key, 每个需要缓存的Zustand模块都必须分配一个唯一key
        name: StorageSceneKey.USER,
        storage: createJSONStorage(() => userStorage),
      }
    )
  )
)
export const useUserStore = createSelectors(userStore)
export function useUserReset() {
  userStore.setState(initialState)
}
```

:::
