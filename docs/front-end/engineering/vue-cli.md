---
title: Vue-Cli工程搭建
---

::: tip ✨
搭建一个开箱即用的基于 Vue-Cli + Vue2 + Vuex + Vant + TailwindCSS + TypeScript 的工程

UI框架以 Vant 为例

[本工程的Github地址](https://github.com/welives/vue-cli-starter)

编写此笔记时所使用的`Vue-Cli`版本为`5.0.0`，`Vue`版本为`2.6.14`
:::

## 相关文档

- [Vue-Cli](https://cli.vuejs.org/zh/)
- [Vue2](https://v2.cn.vuejs.org/)
- [Vuex](https://v3.vuex.vuejs.org/zh/)
- [Vue-Router](https://v3.router.vuejs.org/zh/)
- [vuex-composition-helpers](https://github.com/greenpress/vuex-composition-helpers#readme)
- [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)
- [Vant](https://vant-contrib.gitee.io/vant/v2/#/zh-CN/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 初始化项目

```sh
npm i -g @vue/cli
vue create vue-cli-starter
```

![](./assets/vue-clil/vue-cli-init.png)

按照提示操作即可，这样一个基础项目就创建好了

::: tip 💡
通过上述交互式命令的选项，我们创建了一个带有`vue-router`、`vuex`、`ESLint`和`Prettier`的基于 Vue-Cli 脚手架的 Vue2 项目
:::

编辑`tsconfig.json`，关闭空检查

```json
{
  "compilerOptions": {
    "strictNullChecks": false
  }
}
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

## 配置ESLint

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

编辑`.eslintrc.js`

```js
module.exports = {
  root: true,
  env: {
    browser: true, // [!code ++]
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'prettier', // [!code ++]
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'], // [!code ++]
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module', // [!code ++]
  },
  rules: {
    'prettier/prettier': 'error', // [!code ++]
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

## 安装TailwindCSS

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
module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,jsx,tsx}'],
  theme: {
    extend: { colors },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
```

新建`src/assets/main.css`，填写如下内容，然后在`src/main.ts`引入它

::: code-group

```css [main.css]
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts [main.ts]
// ...
import './assets/main.css' // [!code ++]
```

:::

## 环境变量

关于 Vue-Cli 的环境变量，可以[参考官方文档](https://cli.vuejs.org/zh/guide/mode-and-env.html)

新建`.env`文件，填入项目所需的环境变量。注意，自定义环境变量名必须以`VUE_APP_`开头，否则不会被识别，例如

```ini
VUE_APP_NAME=vue-cli-starter
VUE_APP_HOST=localhost
VUE_APP_PORT=8080
API_HOST=http://localhost
API_PORT=8080
VUE_APP_BASE_API=$API_HOST:$API_PORT
```

之后就可以在代码中以 `process.env.VUE_APP_XXX` 的形式使用自定义环境变量了

## 迁移至Vue2.7

```sh
pnpm update vue
pnpm update @vue/cli*
pnpm update eslint-plugin-vue@9
pnpm rm vue-template-compiler
rm pnpm-lock.yaml
rm -rf node_modules
pnpm install
```

编辑`tsconfig.json`，添加`vueCompilerOptions`字段

```json
{
  // ...
  "vueCompilerOptions": {
    "target": 2.7
  }
}
```

由于`vuex`和`vue-router`均为不支持`组合式API`的`v3`版本，需要通过中间函数来代替访问`this`下的一些实例方法。新建`src/hooks/index.ts`，添加如下代码

```ts
import { getCurrentInstance } from 'vue'
export function useStore() {
  const { proxy } = getCurrentInstance()
  const store = proxy.$store
  return store
}
export function useRouter() {
  const { proxy } = getCurrentInstance()
  const router = proxy.$router
  return router
}
export function useRoute() {
  const { proxy } = getCurrentInstance()
  const route = proxy.$route
  return route
}
```

但是`vuex`的`mapState`、`mapGetters`、`mapActions`和`mapMutations`辅助函数依然是无法使用的，如果想使用这些辅助函数，可以尝试安装`vuex-composition-helpers`这个库

```sh
pnpm add vuex-composition-helpers@1.2.0
```

## 助手函数

新建`src/utils/utils.ts`，封装一些辅助函数，具体代码参考我的[助手函数封装](../encapsulation.md#helper)

## 请求模块

```sh
pnpm add axios
```

新建`src/api/core/http.ts`和`src/api/core/config.ts`，之后的封装逻辑参考我的[Axios封装](../encapsulation.md#axios)

### Mock

```sh
pnpm add -D vue-cli-plugin-mock mockjs @types/mockjs
```

根目录新建`mock/index.js`，示例如下，根据自己的情况添加添加接口

```js
export default {
  'POST /api/login': {
    code: '200',
    message: 'ok',
    data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs',
    success: true,
  },
}
```

- 使用

```ts
import { request } from './api'
request('/api/login', { method: 'POST' })
```

注意，`vue-cli-plugin-mock`默认是以当前开发服务器的`host`和`post`作为`baseURL`

## 状态管理

### 示例

编辑`src/store/index.ts`和`src/views/AboutView.vue`

::: code-group

```ts [store]
export default new Vuex.Store({
  state: {
    count: 0, // [!code focus]
  },
  getters: {},
  mutations: {
    // [!code focus:7]
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
  },
  actions: {},
  modules,
})
```

```vue [AboutView]
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <button @click="decrement()">-</button>
      <span class="mx-3">{{ count }}</span>
      <button @click="increment()">+</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useState, useMutations } from 'vuex-composition-helpers'
const { count } = useState(['count'])
const { increment, decrement } = useMutations(['increment', 'decrement'])
</script>
```

:::

### 持久化

```sh
pnpm add vuex-persistedstate
```

新建`src/store/modules/user.ts`

```ts
type State = typeof state
const state = {
  token: '',
  isLogged: false,
}
const mutations = {
  setToken(state: State, token: string) {
    state.token = token
    state.isLogged = true
  },
  removeToken(state: State) {
    state.token = ''
    state.isLogged = false
  },
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
```

编辑`src/store/index.ts`

```ts
// ...
import createPersistedState from 'vuex-persistedstate'
// 导入其他vuex模块
const modulesFiles = require.context('./modules', true, /\.ts$/)
const modules = modulesFiles.keys().reduce((modules: Record<string, unknown>, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules,
  // ...
})
```

使用

```vue
<template>
  <div class="flex justify-center gap-3">
    <button @click="login">Login</button>
    <button @click="removeToken()">Logout</button>
  </div>
</template>
<script lang="ts" setup>
import { useMutations } from 'vuex-composition-helpers'
import { request } from '@/api'
const { setToken, removeToken } = useMutations('user', ['setToken', 'removeToken'])
const login = async () => {
  const res = await request('/api/login', { method: 'POST' })
  setToken(res.data)
}
</script>
```

## 使用Vant

```sh
pnpm add vant@latest-v2
```

### 按需引入

::: tip ⚡ 注意
由于迁移至`Vue2.7`后，`Vant2`文档中的使用`babel-plugin-import`进行按需加载的方式失效了。需要改成用`Vue3`的方式进行按需加载
:::

```sh
pnpm add -D @vant/auto-import-resolver unplugin-vue-components
```

编辑`vue.config.js`

```js
const { VantResolver } = require('@vant/auto-import-resolver') // [!code ++]
const ComponentsPlugin = require('unplugin-vue-components/webpack') // [!code ++]
module.exports = defineConfig({
  // ... // [!code focus:8]
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
})
```

这样就完成了 Vant 的按需引入，就可以直接在模板中使用 Vant 组件了，`unplugin-vue-components`会解析模板并自动注册对应的组件，`@vant/auto-import-resolver`会自动引入对应的组件样式

## 移动端适配

此插件的参数配置文档[看这里](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin#readme)

```sh
pnpm add -D postcss-px-to-viewport-8-plugin
```

::: warning ⚡
由于`Vant`使用的设计稿宽度是`375`，而通常情况下，设计师使用的设计稿宽度更多是`750`，那么`Vant`组件在`750`设计稿下会出现样式缩小的问题

解决方案: 当读取的`node_modules`文件是`vant`时，那么就将设计稿宽度变为`375`，读取的文件不是`vant`时，就将设计稿宽度变为`750`
:::

编辑`postcss.config.js`，增加如下`postcss-px-to-viewport-8-plugin`配置项

```js
const path = require('path') // [!code ++]
module.exports = {
  plugins: {
    // ... // [!code focus:8]
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
