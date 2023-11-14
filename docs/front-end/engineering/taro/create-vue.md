---
title: Taro-Vue工程搭建
---

::: tip ✨
搭建一个开箱即用的 Taro + Vue + Pinia + TailwindCSS + TypeScript 工程

UI框架以 NutUI-Vue 为例

[本工程的Github地址](https://github.com/welives/taro-vue-starter)

编写此笔记时所使用的`Taro`版本为`3.6.18`
:::

相关文档

- [Taro](https://nervjs.github.io/taro-docs/docs/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [NutUI-Vue](https://nutui.jd.com/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 初始化项目

```sh
npm install -g @tarojs/cli
taro init taro-vue-starter
```

![](../assets/taro/create-vue.png)

然后按照提示操作即可

::: tip 💡
通过上述交互式命令的选项，我们创建了一个带有`ESLint`的 Vue 基础工程，接下来我们对它做亿点点额外的配置
:::

## 安装Prettier

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
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

把`.eslintrc`改成`.eslintrc.js`，并填入以下配置

::: details 查看

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'taro/vue3',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
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
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

:::

## 环境变量

详细的文档[看这里](https://taro-docs.jd.com/docs/next/env-mode-config)

根目录新建`.env`和`.env.local`文件，接着把项目初始化时自动生成的`.env.dev`重命名为`.env.development`，`.env.prod`重命名为`.env.production`，因为根据`Taro`的开发文档，默认的环境标识是`development`和`production`，而`env`文件的加载规则如下

```
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

`env`文件中的环境变量默认要以`TARO_APP_`开头，否则不会被加载，之后就可以在`src`目录下的所有业务逻辑文件中使用`process.env.TARO_APP_XXX`的形式来读取环境变量值了

## 安装TailwindCSS

在`Taro`中使用`TailwindCSS`的文档说明[看这里](https://docs.taro.zone/docs/tailwindcss)

由于`Taro`已经内置有`postcss`和`autoprefixer`，这两个就不用装了

```sh
pnpm add -D tailwindcss
npx tailwindcss init -p
```

编辑生成的`tailwind.config.js`

```js
const colors = require('tailwindcss/colors')
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{html,vue,js,ts,jsx,tsx}'], // [!code focus]
  theme: {
    extend: { colors }, // [!code focus]
  },
  // [!code focus:4]
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
```

编辑`src/app.scss`

```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

### 单位转化插件

```sh
pnpm add -D postcss-rem-to-responsive-pixel
```

编辑`postcss.config.js`，进行插件的注册

```js
const isH5 = process.env.TARO_ENV === 'h5' // [!code focus]
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // [!code focus:6]
    'postcss-rem-to-responsive-pixel': {
      rootValue: 32, // 1rem = 32rpx
      propList: ['*'], // 默认所有属性都转化
      transformUnit: isH5 ? 'px' : 'rpx', // 转化的单位,可以变成 px / rpx
    },
  },
}
```

### 安装`weapp-tailwindcss`

```sh
pnpm add -D weapp-tailwindcss
npx weapp-tw patch
```

编辑`package.json`

```json
{
  "scripts": {
    // ...
    "postinstall": "weapp-tw patch" // [!code ++]
  }
}
```

编辑`config/index.ts`，注册`weapp-tailwindcss`

```ts
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack' // [!code ++]
const WeappTailwindcssDisabled = ['h5', 'rn'].includes(process.env.TARO_ENV) // [!code ++]
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    // ...
    mini: {
      webpackChain(chain) {
        // ...
        // [!code focus:9]
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [{ appType: 'taro', disabled: WeappTailwindcssDisabled }],
            },
          },
        })
      },
    },
  }
})
```

## UI组件库

这里选用的是[NutUI-Vue](https://nutui.jd.com/#/)

```sh
pnpm add @nutui/nutui-taro @nutui/icons-vue-taro @tarojs/plugin-html
```

编辑`config/index.ts`

```ts
import path from 'node:path' // [!code ++]
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    // [!code focus:35]
    designWidth: (input: any) => {
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375
      }
      return 750
    },
    plugins: ['@tarojs/plugin-html'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    sass: {
      data: '@import "@nutui/nutui-taro/dist/styles/variables.scss";',
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ['nut-'],
          },
        },
      },
    },
    h5: {
      esnextModules: ['nutui-taro', 'icons-vue-taro'],
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ['nut-'],
          },
        },
      },
    },
  }
})
```

### 按需引入和JSX支持

```sh
pnpm add -D unplugin-vue-components
```

编辑`config/index.ts`

```ts
import ComponentsPlugin from 'unplugin-vue-components/webpack' // [!code ++]
import NutUIResolver from '@nutui/nutui-taro/dist/resolver' // [!code ++]
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    // [!code focus:29]
    mini: {
      webpackChain(chain) {
        chain.plugin('unplugin-vue-components').use(
          ComponentsPlugin({
            include: [
              /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
              /\.vue$/,
              /\.vue\?vue/, // .vue
            ],
            resolvers: [NutUIResolver({ taro: true })],
          })
        )
      },
    },
    h5: {
      webpackChain(chain) {
        chain.plugin('unplugin-vue-components').use(
          ComponentsPlugin({
            include: [
              /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
              /\.vue$/,
              /\.vue\?vue/, // .vue
            ],
            resolvers: [NutUIResolver({ taro: true })],
          })
        )
      },
    },
  }
})
```

编辑`tsconfig.json`，在`include`字段中加入`components.d.ts`

```json
{
  "include": [
    // ...
    "components.d.ts"
  ]
}
```

## 请求模块

```sh
pnpm add @tarojs/plugin-http axios
```

编辑`config/index.ts`，注册插件

```ts
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    // ...
    plugins: ['@tarojs/plugin-http'], // [!code focus]
  }
})
```

新建`src/api/core/http.ts`和`src/api/core/config.ts`，之后的封装逻辑参考我的[Axios封装](../../axios.md)

### Mockjs

```sh
pnpm add -D @tarojs/plugin-mock mockjs @types/mockjs
```

编辑`config/dev.ts`

```ts
export default {
  plugins: ['@tarojs/plugin-mock'],
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: process.env.TARO_APP_API,
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  },
} satisfies UserConfigExport
```

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

当启动开发服务器的时候就会启动一个数据`mock`服务器

## 状态管理

这里用的是[Pinia](https://pinia.vuejs.org/zh/)

```sh
pnpm add pinia
```

编辑`src/app.ts`

```ts
import { createPinia } from 'pinia' // [!code ++]
const App = createApp({
  // ...
}).use(createPinia()) // [!code ++]
export default App
```

### 定义

新建`src/stores/counter.ts`

```ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
})
```

### 示例

新建两个页面用来测试

```sh
taro create home
taro create profile
```

编辑`src/app.config.ts`和新建的两个页面

::: code-group

```ts [app.config.ts]
const pages = ['pages/index/index', 'pages/home/index', 'pages/profile/index']
export default defineAppConfig({
  animation: true,
  entryPagePath: 'pages/index/index',
  pages,
  tabBar: {
    color: '#666666',
    selectedColor: '#4965f2',
    backgroundColor: '#fefefe',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      },
    ],
  },
  // ...
})
```

```tsx [Home]
import { View, Text, Button } from '@tarojs/components'
import { defineComponent } from 'vue'
import { useCounterStore } from '@/stores'
import './index.scss'
export default defineComponent({
  setup() {
    const counter = useCounterStore()
    return () => (
      <View class="flex flex-1 flex-wrap flex-col items-center justify-center gap-4 h-full">
        <Text>Home Page</Text>
        <View class="text-center">
          <Button type="warn" onClick={counter.decrement}>
            Dec
          </Button>
          <Text>{counter.count}</Text>
          <Button type="primary" onClick={counter.increment}>
            Inc
          </Button>
        </View>
      </View>
    )
  },
})
```

```vue [Profile]
<template>
  <view class="flex flex-1 flex-wrap flex-col items-center justify-center gap-4 h-full">
    <text>Profile Page</text>
    <view class="text-center">
      <button type="warn" @tap="counter.decrement">Dec</button>
      <text>{{ counter.count }}</text>
      <button type="primary" @tap="counter.increment">Inc</button>
    </view>
  </view>
</template>

<script setup>
import { useCounterStore } from '@/stores'
import './index.scss'
const counter = useCounterStore()
</script>
```

:::

### 持久化

```sh
pnpm add pinia-plugin-persistedstate
```

编辑`src/app.ts`

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // [!code ++]
const App = createApp({
  // ...
}).use(createPinia().use(piniaPluginPersistedstate)) // [!code ++]
export default App
```

新建`src/utils/storage.ts`和`src/stores/user.ts`

::: code-group

```ts [storage.ts]
import { setStorageSync, getStorageSync, removeStorageSync } from '@tarojs/taro'

enum StorageSceneKey {
  DEVICE = 'storage-device-uuid',
  USER = 'storage-user',
}

function getItem<T = any>(key: string): T {
  const value = getStorageSync(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  setStorageSync(key, JSON.stringify(value))
}
function removeItem(key: string) {
  removeStorageSync(key)
}

export { getItem, setItem, removeItem, StorageSceneKey }
```

```ts [user.ts]
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setStorageSync, getStorageSync } from '@tarojs/taro'
import { StorageLike } from 'pinia-plugin-persistedstate'
import { StorageSceneKey } from '../utils'
const userStorage: StorageLike = {
  getItem: (key) => {
    const value = getStorageSync(key)
    return value ?? null
  },
  setItem: (key, value) => {
    setStorageSync(key, value)
  },
}
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
      // pinia-plugin-persistedstate 插件的默认持久化方案只支持web端，在Taro里使用需要自定义进行覆盖
      storage: userStorage,
    },
  }
)
```

:::

## 路由权限

新建`src/routes/index.ts`，对`Taro`的路由跳转做一层权限控制的封装

::: details 查看

```ts
import Taro, { EventChannel } from '@tarojs/taro'
import { useUserStore } from '@/stores'

interface IRouterOptions<T = any> {
  url: string
  data?: T
  complete?: (res: TaroGeneral.CallbackResult) => void
  fail?: (res: TaroGeneral.CallbackResult) => void
  success?: (res: TaroGeneral.CallbackResult) => void
}
interface NavigateToOptions<T = any> extends IRouterOptions<T> {
  events?: TaroGeneral.IAnyObject
  success?: (res: TaroGeneral.CallbackResult & { eventChannel: EventChannel }) => void
}
interface NavigateBackOptions extends Omit<IRouterOptions, 'url' | 'data'> {
  delta?: number
}
type RouterOptions<T = any> = NavigateToOptions<T> & NavigateBackOptions
type RouterType = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack'

/**
 * 路由跳转处理
 */
function handleRouter(urlKey: string, type: RouterType, options: RouterOptions) {
  const isLogged = useUserStore().isLogged
  if (authRoutes.includes(urlKey)) {
    if (!isLogged) {
      // TODO 补充自己的业务逻辑
      return
    }
    navigate(type, options)
  } else {
    navigate(type, options)
  }
}
/**
 * 执行路由跳转
 */
function navigate(type: RouterType, options: RouterOptions) {
  const { data, ...rest } = options
  if (!Taro.hasOwnProperty(type)) return
  if (!rest.url.startsWith('/')) {
    rest.url = `/${rest.url}`
  }
  Taro[type](rest)
}

const singletonEnforcer = Symbol('Router')
class Router {
  private static _instance: Router
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
  }
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    this._instance || (this._instance = new Router(singletonEnforcer))
    return this._instance
  }
  /**
   * 路由中间件,做跳转前的代理
   */
  private middleware(type: RouterType, options: RouterOptions) {
    let { url = '', data = {}, events, ...rest } = options
    // 单独存一份url,待会要用
    const key = url
      .split('/')
      .filter((e) => e !== '')
      .join('/')
    try {
      if (type === 'navigateBack') {
        Taro.navigateBack(rest)
      } else {
        if (!key.trim() || !routes.includes(key)) {
          throw Error('无效的路由')
        }
        // 不是tabbar的话就给路由拼上参数
        options.url = type === 'switchTab' ? key : key + '?' + new URLSearchParams(data).toString()
        handleRouter(key, type, options)
      }
    } catch (error) {
      console.error(error.message)
      // TODO
    }
  }
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  switchTab(options: IRouterOptions) {
    this.middleware('switchTab', options)
  }
  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch(options: IRouterOptions) {
    this.middleware('reLaunch', options)
  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
   */
  redirectTo(options: IRouterOptions) {
    this.middleware('redirectTo', options)
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
   */
  navigateTo(options: NavigateToOptions) {
    this.middleware('navigateTo', options)
  }
  /**
   * 关闭当前页面，返回上一页面或多级页面
   */
  navigateBack(options: NavigateBackOptions) {
    this.middleware('navigateBack', { url: '', ...options })
  }
}
// 需要权限的路由,注意首尾不能带有斜杠
const authRoutes = ['pages/home/index', 'pages/profile/index']
// 全部路由
const routes = ['pages/blank/index', 'pages/index/index', 'pages/home/index', 'pages/profile/index']
export default Router.instance
```

:::

新建一个空白页面用来做权限判断的跳板页，并将其设置为启动页面

```sh
taro create blank
```

```ts
export default defineAppConfig({
  entryPagePath: 'pages/blank/index', // [!code ++]
  // ...
})
```

### 使用

编辑刚才新建的`blank`页面

```tsx
import { defineComponent } from 'vue'
import { useLoad } from '@tarojs/taro'
import { useUserStore } from '@/stores'
import router from '@/routes'
export default defineComponent({
  setup() {
    const userStore = useUserStore()
    useLoad(() => {
      if (userStore.isLogged) {
        router.switchTab({ url: '/pages/home/index' })
      } else {
        router.reLaunch({ url: '/pages/index/index' })
      }
    })
    return null
  },
})
```
