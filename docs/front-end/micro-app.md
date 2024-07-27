---
title: 京东Micro-App微前端学习
head:
  - - meta
    - name: description
      content: 京东Micro-App微前端学习
  - - meta
    - name: keywords
      content: micro-app 微前端 vue react svelte 主应用 子应用 应用通信 pnpm
---

::: tip ✨ 京东Micro-App微前端学习

此 Demo 以`UmiJS 4`作为基座主应用，子应用分别为使用了`create-react-app`、`vue-cli`、`vite`创建的`React 18`、`Vue2`、`Vue3`和`Svelte`项目

[此Demo的Github地址](https://github.com/welives/micro-app-demo)

编写此笔记时所使用的`Micro-App`版本为`1.0.0-rc.2`
:::

## 相关文档

- [Micro-App](https://micro-zoe.github.io/micro-app/)
- [UmiJS](https://umijs.org/)
- [Vite](https://cn.vitejs.dev/)
- [React](https://zh-hans.react.dev/)
- [Vue](https://cn.vuejs.org/)
- [Svelte](https://www.svelte.cn/)

## 主应用构建

新建一个`micro-app-demo`目录，这里将使用`pnpm`的`monorepo`模式管理各项目

:::code-group

```sh
mkdir micro-app-demo && cd micro-app-demo
mkdir apps
pnpm init
touch pnpm-workspace.yaml
pnpm add -wD typescript @types/node
touch tsconfig.json
touch .gitignore
```

```yaml [pnpm-workspace]
packages:
  - 'apps/*'
```

```json [tsconfig]
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "Node",
    "allowJs": true,
    "sourceMap": true,
    "strict": true, // 启用所有严格类型检查选项
    "noEmit": true, // 不生成输出文件
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "isolatedModules": true, // 将每个文件做为单独的模块
    "resolveJsonModule": true, // 允许加载 JSON 文件
    "skipLibCheck": true, // 跳过.d.ts类型声明文件的类型检查
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": false, // 启用严格的 null 检查
    "esModuleInterop": true, // 用来兼容commonjs的
    "emitDecoratorMetadata": true, // 为装饰器提供元数据的支持
    "experimentalDecorators": true, // 启用装饰器
    "types": ["node"]
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/examples/**",
    "**/docs/**",
    "**/playground/**",
    "**/test/**"
  ]
}
```

```ini [.gitignore]
node_modules/
.DS_Store
dist/
build/

# editor config
.vscode/
.idea
*.iml
*.swp
*.swo
*.code-workspace

# istanbul
coverage

# Local env files
.env*.local

# Logs
logs
*.log
# eslint
.eslintcache
```

:::

然后在`apps`目录中把之前搭建的 [UmiJS](./engineering/umijs.md) 工程`clone`下来作为主应用

```sh
cd apps
git clone https://github.com/welives/umijs-starter.git main-app
cd main-app
pnpm install
pnpm add @micro-zoe/micro-app
```

编辑`src/global.tsx`，初始化`micro-app`

```ts
import microApp from '@micro-zoe/micro-app' // [!code ++]
microApp.start() // [!code ++]
```

之前整这个`UmiJS`的基础项目时，预先装了一些模块和包，有些在这里用不上，可以移除掉精简一下主应用，同时删掉目录下的`eslint`、`prettier`和`stylelint`的配置文件

```json
{
  // ...
  "dependencies": {
    "@ant-design/icons": "^5.4.0",
    "@micro-zoe/micro-app": "1.0.0-rc.2",
    "antd": "^5.19.3",
    "umi": "^4.3.10"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@umijs/plugins": "^4.3.10",
    "typescript": "^5.5.4"
  }
}
```

## 子应用构建

理论上，通过`micro-app`构建微前端项目，在服务间不通信的前提下，子服务只需要配置跨域就可以，其他都不需要弄，可以说是完全零侵入、低成本的方案

所有的子应用同样也是在`apps`目录下创建

### 子应用①

这里使用`create-react-app`脚手架创建一个`react18`子应用①

```sh
pnpm create react-app child-react18 --template typescript
```

通过`create-react-app`构建的项目默认就进行了跨域的相关配置。如果不放心，或者想更改`webpack`的配置，可以执行`npm run eject`把脚手架隐藏起来的配置暴露出来

新建`.env`文件，添加如下环境变量，让子应用①运行在`3100`端口上

```ini
# 关闭自动打开浏览器
BROWSER=none
# 本地HOST
HOST=localhost
# 本地端口
PORT=3100
# 部署用的二级路由
PUBLIC_URL='/child/react18'
```

编辑`src/App.tsx`，给其加上一个标识

```tsx
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>子应用① -- React@{React.version}</h1> // [!code ++]
      </header>
    </div>
  )
}
```

### 子应用②

这里使用`vue-cli`脚手架创建一个`vue2`默认配置的子应用②

```sh
vue create child-vue2
```

新建`.env`文件，添加如下环境变量，让子应用②运行在`3200`端口上

```ini
VUE_APP_HOST=localhost
VUE_APP_PORT=3200
```

编辑`vue.config.js`和`src/App.vue`

::: code-group

```js [vue.config.js]
module.exports = defineConfig({
  devServer: {
    host: process.env.VUE_APP_HOST, // [!code ++]
    port: process.env.VUE_APP_PORT, // [!code ++]
    headers: {
      'Access-Control-Allow-Origin': '*', // [!code ++]
    },
  },
  // 配合部署用的
  publicPath: '/child/vue2', // [!code ++]
})
```

```vue [App.vue]
<template>
  <div id="app">
    <h1>子应用② -- Vue@2.6.14</h1>
  </div>
</template>
```

:::

### 子应用③

这里使用`vite`脚手架创建一个`vue3`子应用③

```sh
pnpm create vue child-vue3
```

`vite`默认开启跨域支持，不需要额外配置

新建`.env`文件，添加如下环境变量，让子应用③运行在`3300`端口上

```ini
VITE_APP_HOST=localhost
VITE_APP_PORT=3300
```

编辑`vite.config.ts`和`src/App.vue`

::: code-group

```ts [vite.config.ts]
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // [!code ++]
  const PORT = parseInt(env.VITE_APP_PORT) // [!code ++]
  return {
    // 配合部署用的
    base: '/child/vite-vue3', // [!code ++]
    server: {
      host: env.VITE_APP_HOST, // [!code ++]
      port: isNaN(PORT) ? undefined : PORT, // [!code ++]
    },
    // ...
  }
})
```

```vue{4} [App.vue]
<template>
  <header>
    <div class="wrapper">
      <h1>子应用③ -- Vue@{{ version }}</h1>
    </div>
  </header>
</template>
```

:::

### 子应用④

这里使用`vite`脚手架创建一个`svelte`子应用④

```sh
pnpm create vue child-svelte
```

新建`.env`文件，添加如下环境变量，让子应用④运行在`3400`端口上

```ini
VITE_APP_HOST=localhost
VITE_APP_PORT=3400
```

编辑`vite.config.ts`和`src/App.svelte`

::: code-group

```ts [vite.config.ts]
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // [!code ++]
  const PORT = parseInt(env.VITE_APP_PORT) // [!code ++]
  return {
    // 配合部署用的
    base: '/child/vite-svelte', // [!code ++]
    server: {
      host: env.VITE_APP_HOST, // [!code ++]
      port: isNaN(PORT) ? undefined : PORT, // [!code ++]
    },
    // ...
  }
})
```

```svelte [App.svelte]
<main>
  <h1>子应用④ -- Svelte@4.0.5</h1>
</main>
```

:::

## 建立关联

在主应用中新建`src/constants/index.ts`文件，填入如下内容

```ts
export enum ChildAppName {
  CHILD_REACT18 = 'child-react18',
  CHILD_VUE2 = 'child-vue2',
  CHILD_VUE3 = 'child-vue3',
  CHILD_SVELTE = 'child-svelte',
}
```

在主应用的根目录新建`micro-app-config.ts`

```ts
import { ChildAppName } from './src/constants'

const config = {
  [ChildAppName.CHILD_REACT18]: 'http://localhost:3100',
  [ChildAppName.CHILD_VUE2]: 'http://localhost:3200',
  [ChildAppName.CHILD_VUE3]: 'http://localhost:3300',
  [ChildAppName.CHILD_SVELTE]: 'http://localhost:3400',
}

// 线上环境地址
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(config).forEach((key) => {
    config[key as `${ChildAppName}`] = window.location.origin
  })
}
export default Object.freeze(config)
```

编辑主应用的`.umirc.ts`或`config/config.ts`文件，新增如下路由

```ts {3-13}
import { ChildAppName } from './src/constants'
export default defineConfig({
  routes: [
    { path: '/', component: 'index', name: 'Home' },
    {
      path: ChildAppName.CHILD_REACT18,
      component: 'child-react18',
      name: ChildAppName.CHILD_REACT18,
    },
    { path: ChildAppName.CHILD_VUE2, component: 'child-vue2', name: ChildAppName.CHILD_VUE2 },
    { path: ChildAppName.CHILD_VUE3, component: 'child-vue3', name: ChildAppName.CHILD_VUE3 },
    { path: ChildAppName.CHILD_SVELTE, component: 'child-svelte', name: ChildAppName.CHILD_SVELTE },
  ],
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/model', '@umijs/plugins/dist/antd', '@umijs/plugins/dist/layout'],
  model: {},
  antd: {},
  layout: {
    title: 'UmiJS Starter',
  },
})
```

新建如下四个页面，用来装载子应用

::: code-group

```tsx [child-react18.tsx]
import { ChildAppName } from '../constants'
import microAppConfig from '../../micro-app-config'
export default function SubReactApp() {
  return (
    <div>
      <micro-app
        name={ChildAppName.CHILD_REACT18}
        url={`${microAppConfig[ChildAppName.CHILD_REACT18]}/child/react18`}
      ></micro-app>
    </div>
  )
}
```

```tsx [child-vue2.tsx]
import { ChildAppName } from '../constants'
import microAppConfig from '../../micro-app-config'
export default function VueCliApp() {
  return (
    <div>
      <micro-app
        name={ChildAppName.CHILD_VUE2}
        url={`${microAppConfig[ChildAppName.CHILD_VUE2]}/child/vue2`}
      ></micro-app>
    </div>
  )
}
```

```tsx [child-vue3.tsx]
import { ChildAppName } from '../constants'
import microAppConfig from '../../micro-app-config'
export default function ViteVueApp() {
  return (
    <div>
      <micro-app
        name={ChildAppName.CHILD_VUE3}
        url={`${microAppConfig[ChildAppName.CHILD_VUE3]}/child/vite-vue3`}
        iframe
      ></micro-app>
    </div>
  )
}
```

```tsx [child-svelte.tsx]
import { ChildAppName } from '../constants'
import microAppConfig from '../../micro-app-config'
export default function ViteSvelteApp() {
  return (
    <div>
      <micro-app
        name={ChildAppName.CHILD_SVELTE}
        url={`${microAppConfig[ChildAppName.CHILD_SVELTE]}/child/vite-svelte`}
        iframe
      ></micro-app>
    </div>
  )
}
```

:::

::: tip 🎉
到这里，最简单的主应用和子应用架构就已经搭建好了
:::

## 进阶操作

### 生命周期

同一种主应用框架中的每一个`<micro-app>`挂载点的生命周期事件写法都是一样的，所以这里以 `child-react18.tsx` 为例

```tsx [child-react18.tsx]
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
// ...
export default function SubReactApp() {
  const onCreated = () => {
    console.log('基座 >>> 子应用① 创建了')
  }
  const onBeforemount = () => {
    console.log('基座 >>> 子应用① 即将被渲染')
  }
  const onMounted = () => {
    console.log('基座 >>> 子应用① 已经渲染完成')
  }
  const onUnmount = () => {
    console.log('基座 >>> 子应用① 已经卸载')
  }
  const onError = () => {
    Modal.error({
      title: '提示',
      content: '子应用① 加载失败',
    })
  }
  return (
    <Space direction="vertical" size="middle">
      <micro-app
        name={ChildAppName.CHILD_REACT18}
        url={`${microAppConfig[ChildAppName.CHILD_REACT18]}/child/react18`}
        onCreated={onCreated}
        onBeforemount={onBeforemount}
        onMounted={onMounted}
        onUnmount={onUnmount}
        onError={onError}
      ></micro-app>
    </Space>
  )
}
```

### 渲染优化

子应用的渲染优化写法在不同的框架中写法不同

::: warning ⚡ 注意
我这里的子应用①是`React 18` 的写法，`React 16和17` 的写法[参考官方文档](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/react?id=_1%e3%80%81%e5%bc%80%e5%90%afumd%e6%a8%a1%e5%bc%8f%ef%bc%8c%e4%bc%98%e5%8c%96%e5%86%85%e5%ad%98%e5%92%8c%e6%80%a7%e8%83%bd)
:::

::: code-group

```tsx [React 18]
// ...
declare global {
  interface Window {
    microApp: any
    __MICRO_APP_NAME__: string
    __MICRO_APP_ENVIRONMENT__: boolean
    __MICRO_APP_BASE_ROUTE__: string
    __MICRO_APP_PUBLIC_PATH__: string
    mount: () => void
    unmount: () => void
  }
  type AnyObj = Record<string, any>
}
const domNode = document.getElementById('root')
let root: ReactDOM.Root
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  root = ReactDOM.createRoot(domNode as HTMLElement)
  root.render(<App />)
  console.log('子应用① >>> 渲染了')
}
// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  root.unmount()
  console.log('子应用① >>> 卸载了')
}
// 👇 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
```

```ts [Vue 2]
// ...
declare global {
  interface Window {
    microApp: any
    __MICRO_APP_NAME__: string
    __MICRO_APP_ENVIRONMENT__: boolean
    __MICRO_APP_BASE_ROUTE__: string
    __MICRO_APP_PUBLIC_PATH__: string
    mount: () => void
    unmount: () => void
  }
  type AnyObj = Record<string, any>
}
let app: any = null
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app')
  console.log('子应用② >>> 渲染了')
}
// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  app.$destroy()
  app.$el.innerHTML = ''
  app = null
  console.log('子应用② >>> 卸载了')
}
// 👇 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
```

```ts [Vue 3]
// ...
declare global {
  interface Window {
    microApp: any
    __MICRO_APP_NAME__: string
    __MICRO_APP_ENVIRONMENT__: boolean
    __MICRO_APP_BASE_ROUTE__: string
    __MICRO_APP_PUBLIC_PATH__: string
    mount: () => void
    unmount: () => void
  }
  type AnyObj = Record<string, any>
}
let app: AppInstance | null = null
let router: Router | null = null
let history: RouterHistory | null = null
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || import.meta.env.BASE_URL)
  router = createRouter({ history, routes })
  app = createApp(App)
  app.use(router)
  app.mount('#app')
}
// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  app?.unmount()
  history?.destroy()
  app = null
  router = null
  history = null
}
// 👇 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
```

```ts [Svelte]
// ...
declare global {
  interface Window {
    microApp: any
    __MICRO_APP_NAME__: string
    __MICRO_APP_ENVIRONMENT__: boolean
    __MICRO_APP_BASE_ROUTE__: string
    __MICRO_APP_PUBLIC_PATH__: string
    mount: () => void
    unmount: () => void
  }
  type AnyObj = Record<string, any>
}
let app: any = null
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  app = new App({
    target: document.getElementById('app'),
  })
  console.log('子应用④ >>> 渲染了')
}
// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  app.$destroy()
  app = null
  console.log('子应用④ >>> 卸载了')
}
// 👇 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
```

:::

### 数据通信

#### child-react18

::: code-group

```tsx [child-react18.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function SubReactApp() {
  const childBaseRoute = `/${ChildAppName.CHILD_REACT18}`
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()

  // ...省略的代码参考上面生命周期

  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData(ChildAppName.CHILD_REACT18, { data: `来自基座的数据 ${+new Date()}` })
  }
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Input placeholder="发送给子应用①的数据" onChange={(e) => setMsg(e.target.value)}></Input>
        <Button type="primary" onClick={sendData}>
          setData发送数据
        </Button>
        <Typography.Text>{JSON.stringify(childMsg)}</Typography.Text>
      </Space>
      <micro-app
        name={ChildAppName.CHILD_REACT18}
        url={`${microAppConfig[ChildAppName.CHILD_REACT18]}/child/react18`}
        baseroute={childBaseRoute}
        disable-memory-router
        clear-data
        // 通过 data 属性发送数据给子应用
        data={{ msg }}
        onDataChange={onDataChange}
      ></micro-app>
    </Space>
  )
}
```

```tsx [子应用① App.tsx]
function App() {
  const [data, setData] = React.useState<AnyObj>()
  const handleMicroData = (data: AnyObj) => {
    setData(data)
  }
  React.useEffect(() => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 主动获取基座下发的数据
      const parentData = window.microApp.getData()
      console.log('子应用① >>> getData:', parentData)
      setData(parentData)
      // 监听基座下发的数据变化
      window.microApp.addDataListener(handleMicroData)
    }
    return () => {
      if (window.__MICRO_APP_ENVIRONMENT__) {
        window.microApp.removeDataListener(handleMicroData)
      }
    }
  }, [])
  const sendData = () => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 向基座发送数据,只接受对象作为参数
      window.microApp.dispatch({
        msg: `来自子应用①的数据 ${+new Date()}`,
      })
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>子应用① -- React@{React.version}</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>{JSON.stringify(data)}</p>
        <button onClick={sendData}>发送数据给基座</button>
      </header>
    </div>
  )
}
```

:::

#### child-vue2

子应用② 演示了关闭虚拟路由并从基座获取基础路由，更详细的说明[参考官方文档](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/router)

::: code-group

```tsx [child-vue2.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function VueCliApp() {
  const childBaseRoute = `/${ChildAppName.CHILD_VUE2}`
  // 操作子应用的路由
  const controlChildRouter = () => {
    microApp.router.push({ name: ChildAppName.CHILD_VUE2, path: `${childBaseRoute}/about` })
  }
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Button type="primary" onClick={controlChildRouter}>
          打开子应用About页面
        </Button>
      </Space>
      <micro-app
        name={ChildAppName.CHILD_VUE2}
        url={`${microAppConfig[ChildAppName.CHILD_VUE2]}/child/vue2`}
        baseroute={childBaseRoute}
        disable-memory-router
      ></micro-app>
    </Space>
  )
}
```

```ts [子应用② 路由]
// ...
const router = new VueRouter({
  mode: 'history',
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes,
})
```

```vue [子应用② About页面]
<template>
  <div class="about">
    <p>{{ JSON.stringify(data) }}</p>
    <button @click="sendData">发送数据给基座</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      data: null as AnyObj,
    }
  },
  created() {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 主动获取基座下发的数据
      const parentData = window.microApp.getData()
      console.log('子应用② >>> getData:', parentData)
      this.data = parentData
      // 监听基座下发的数据变化
      window.microApp.addDataListener(this.handleMicroData)
    }
  },
  destroyed() {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      window.microApp.removeDataListener(this.handleMicroData)
    }
  },
  methods: {
    handleMicroData(data: AnyObj) {
      this.data = data
    },
    sendData() {
      if (window.__MICRO_APP_ENVIRONMENT__) {
        // 向基座发送数据,只接受对象作为参数
        window.microApp.dispatch({
          msg: `来自子应用②的数据 ${+new Date()}`,
        })
      }
    },
  },
})
</script>
```

:::

#### child-vue3

::: code-group

```tsx [child-vue3.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function ViteVueApp() {
  const childBaseRoute = `/${ChildAppName.CHILD_VUE3}`
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()
  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData(ChildAppName.CHILD_VUE3, { data: `来自基座的数据 ${+new Date()}` })
  }
  // 操作子应用的路由
  const controlChildRouter = () => {
    microApp.router.push({ name: ChildAppName.CHILD_VUE3, path: '/about' })
  }
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Input placeholder="发送给子应用③的数据" onChange={(e) => setMsg(e.target.value)}></Input>
        <Button type="primary" onClick={sendData}>
          setData发送数据
        </Button>
        <Button type="primary" onClick={controlChildRouter}>
          打开子应用About页面
        </Button>
        <Typography.Text>{JSON.stringify(childMsg)}</Typography.Text>
      </Space>
      <micro-app
        name={ChildAppName.CHILD_VUE3}
        url={`${microAppConfig[ChildAppName.CHILD_VUE3]}/child/vite-vue3`}
        iframe
        clear-data
        data={{ msg }}
        onDataChange={onDataChange}
      ></micro-app>
    </Space>
  )
}
```

```vue [子应用③ About页面]
<template>
  <div class="about">
    <p>{{ JSON.stringify(data) }}</p>
    <button @click="sendData">发送数据给基座</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted } from 'vue'
onBeforeMount(() => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    const parentData = window.microApp.getData()
    console.log('子应用③ >>> getData:', parentData)
    data.value = parentData
    // 监听基座下发的数据变化
    window.microApp.addDataListener(handleMicroData)
  }
})
onUnmounted(() => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    window.microApp.removeDataListener(handleMicroData)
  }
})
const data = ref<AnyObj>()
const handleMicroData = (value: AnyObj) => {
  data.value = value
}
const sendData = () => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 向基座发送数据,只接受对象作为参数
    window.microApp.dispatch({
      msg: `来自子应用③的数据 ${+new Date()}`,
    })
  }
}
</script>
```

:::

#### child-svelte

::: code-group

```tsx [child-svelte.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function ViteSvelteApp() {
  const childBaseRoute = `/${ChildAppName.CHILD_SVELTE}`
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()
  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData(ChildAppName.CHILD_SVELTE, { data: `来自基座的数据 ${+new Date()}` })
  }
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Input placeholder="发送给子应用④的数据" onChange={(e) => setMsg(e.target.value)}></Input>
        <Button type="primary" onClick={sendData}>
          setData发送数据
        </Button>
        <Typography.Text>{JSON.stringify(childMsg)}</Typography.Text>
      </Space>
      <micro-app
        name={ChildAppName.CHILD_SVELTE}
        url={`${microAppConfig[ChildAppName.CHILD_SVELTE]}/child/vite-svelte`}
        baseroute={childBaseRoute}
        disable-memory-router
        iframe
        clear-data
        data={{ msg }}
        onDataChange={onDataChange}
      ></micro-app>
    </Space>
  )
}
```

```svelte [子应用④ App.svelte]
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  onMount(()=>{
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 主动获取基座下发的数据
      const parentData = window.microApp.getData()
      console.log('子应用④ >>> getData:', parentData)
      data = parentData
      // 监听基座下发的数据变化
      window.microApp.addDataListener(handleMicroData)
    }
  })
  onDestroy(()=>{
    if (window.__MICRO_APP_ENVIRONMENT__) {
      window.microApp.removeDataListener(handleMicroData)
    }
  })
  let data: AnyObj = {}
  const handleMicroData = (value: AnyObj) => {
    data = value
  }
  const sendData = () => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 向基座发送数据,只接受对象作为参数
      window.microApp.dispatch({
        msg: `来自子应用④的数据 ${+new Date()}`
      })
    }
  }
</script>
<main>
  // ...
  <p>{ JSON.stringify(data) }</p>
  <button on:click={sendData}>发送数据给基座</button>
</main>
```

:::

## 常见问题

### 子应用静态资源404

在子应用`src`目录下创建`public-path.ts`的文件，并添加如下内容

```ts
// @ts-ignore
if (window.__MICRO_APP_ENVIRONMENT__) {
  // @ts-ignore
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__
}
```

接着在子应用的入口文件的「**最顶部**」引入`public-path.ts`

```tsx
import './public-path'
```

### React基座无法触发生命周期

因为 React 不支持自定义事件，所以我们需要引入一个`polyfill`

「**在`<micro-app>`标签所在的文件顶部**」添加`polyfill`，注释也要复制

```tsx
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
```

## 部署

这里给出一个简易的`Docker` + `Nginx`的部署配置，更细化的部署配置请自己参考官方示例进行研究

在`micro-app-demo`项目的根目录新建`Dockerfile`、`docker-compose.yml`、`.dockerignore`和`nginx.conf`四个文件

:::code-group

```Dockerfile
# 设置基础的node镜像
FROM node:20-slim AS base
# 接收传入的变量
ARG MAIN_APP_NAME
ARG CHILD_REACT_NAME
ARG CHILD_VUE2_NAME
ARG CHILD_VUE3_NAME
ARG CHILD_SVELTE_NAME

ARG CHILD_REACT_FOLDER
ARG CHILD_VUE2_FOLDER
ARG CHILD_VUE3_FOLDER
ARG CHILD_SVELTE_FOLDER

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# 设置淘宝源,否则下载 corepack 时, 失败的概率极大, 虽然本来就挺容易失败的...
RUN npm config set registry https://registry.npmmirror.com
COPY . /app
WORKDIR /app

# 安装依赖
FROM base AS installer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 打包
FROM installer AS builder
RUN pnpm --filter=$MAIN_APP_NAME build
RUN pnpm --filter=$CHILD_REACT_NAME build
RUN pnpm --filter=$CHILD_VUE2_NAME build
RUN pnpm --filter=$CHILD_VUE3_NAME build
RUN pnpm --filter=$CHILD_SVELTE_NAME build


# 设置nginx镜像
FROM nginx:latest
# 接收传入的变量
ARG MAIN_APP_NAME
ARG CHILD_REACT_NAME
ARG CHILD_VUE2_NAME
ARG CHILD_VUE3_NAME
ARG CHILD_SVELTE_NAME

ARG CHILD_REACT_FOLDER
ARG CHILD_VUE2_FOLDER
ARG CHILD_VUE3_FOLDER
ARG CHILD_SVELTE_FOLDER

# 清理默认的ngnix配置
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# 拷贝nginx的部署配置进去
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到nginx的服务目录
COPY --from=builder /app/apps/${MAIN_APP_NAME}/dist /usr/share/nginx/html
COPY --from=builder /app/apps/${CHILD_REACT_NAME}/build /usr/share/nginx/html/child/${CHILD_REACT_FOLDER}
COPY --from=builder /app/apps/${CHILD_VUE2_NAME}/dist /usr/share/nginx/html/child/${CHILD_VUE2_FOLDER}
COPY --from=builder /app/apps/${CHILD_VUE3_NAME}/dist /usr/share/nginx/html/child/${CHILD_VUE3_FOLDER}
COPY --from=builder /app/apps/${CHILD_SVELTE_NAME}/dist /usr/share/nginx/html/child/${CHILD_SVELTE_FOLDER}

# 暴露80端口
EXPOSE 80
# 将nginx转为前台进程
CMD ["nginx", "-g", "daemon off;"]

```

```yml [docker-compose]
version: '3.9'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        # 传入环境变量
        MAIN_APP_NAME: 'main-app'
        CHILD_REACT_NAME: 'child-react18'
        CHILD_VUE2_NAME: 'child-vue2'
        CHILD_VUE3_NAME: 'child-vue3'
        CHILD_SVELTE_NAME: 'child-svelte'

        CHILD_REACT_FOLDER: 'react18'
        CHILD_VUE2_FOLDER: 'vue2'
        CHILD_VUE3_FOLDER: 'vite-vue3'
        CHILD_SVELTE_FOLDER: 'vite-svelte'
    ports:
      - 8080:80
```

```ini [.dockerignore]
node_modules
.git
.gitignore
*.md
dist
```

```nginx [nginx.conf]
server {
  listen 80;
  # 设置服务器名称，本地部署时使用localhost
  server_name localhost;

  # 主应用 Umijs
  location / {
    # 设置网站根目录位置
    root /usr/share/nginx/html;
    # 网站首页
    index index.php index.html index.htm;
    # add_header Cache-Control;
    add_header Access-Control-Allow-Origin *;
    if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
      add_header Cache-Control max-age=7776000;
      add_header Access-Control-Allow-Origin *;
    }
    try_files $uri $uri/ /index.html;
  }

  # 子应用 react18
  location /child/react18 {
    root /usr/share/nginx/html;
    add_header Access-Control-Allow-Origin *;
    if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
      add_header Cache-Control max-age=7776000;
      add_header Access-Control-Allow-Origin *;
    }
    try_files $uri $uri/ /child/react18/index.html;
  }

  # 子应用 vue-cli-vue2
  location /child/vue2 {
    root /usr/share/nginx/html;
    add_header Access-Control-Allow-Origin *;
    if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
      add_header Cache-Control max-age=7776000;
      add_header Access-Control-Allow-Origin *;
    }
    try_files $uri $uri/ /child/vue2/index.html;
  }

  # 子应用 vite-vue3
  location /child/vite-vue3 {
    root /usr/share/nginx/html;
    add_header Access-Control-Allow-Origin *;
    if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
      add_header Cache-Control max-age=7776000;
      add_header Access-Control-Allow-Origin *;
    }
    try_files $uri $uri/ /child/vite-vue3/index.html;
  }

  # 子应用 vite-svelte
  location /child/vite-svelte {
    root /usr/share/nginx/html;
    add_header Access-Control-Allow-Origin *;
    if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
      add_header Cache-Control max-age=7776000;
      add_header Access-Control-Allow-Origin *;
    }
    try_files $uri $uri/ /child/vite-svelte/index.html;
  }
}
```

:::

在项目根目录打开命令行终端，执行`docker compose up -d --build`，等待脚本运行成功后，浏览器访问`localhost:8080`就行

:::warning ⚡注意
在国区拉 docker 镜像比较看脸，我跑这套 docker 脚本的时候，经常出现`corepack`这个包下载失败的情况
:::
