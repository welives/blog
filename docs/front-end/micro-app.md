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

新建一个`micro-app-demo`目录，然后把之前搭建的 [UmiJS](./engineering/umijs.md) 工程`clone`下来作为主应用

```sh
mkdir micro-app-demo && cd micro-app-demo
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

## 子应用构建

理论上，通过`micro-app`构建微前端项目，在服务间不通信的前提下，子服务只需要配置跨域就可以，其他都不需要弄，可以说是完全零侵入、低成本的方案

### 子应用①

这里使用`create-react-app`脚手架创建一个`react`子应用①

```sh
pnpm create react-app sub-react-app --template typescript
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
vue create vue-cli-app
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
pnpm create vue vite-vue-app
cd vite-vue-app
pnpm install
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
pnpm create vue vite-svelte-app
cd vite-svelte-app
pnpm install
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

在主应用中新建`src/utils/childAppConfig.ts`文件，填入如下内容

```ts
type Key = 'sub-react-app' | 'vue-cli-app' | 'vite-vue-app' | 'vite-svelte-app'
const config: Record<Key, string> = {
  'sub-react-app': 'http://localhost:3100',
  'vue-cli-app': 'http://localhost:3200',
  'vite-vue-app': 'http://localhost:3300',
  'vite-svelte-app': 'http://localhost:3400',
}
// 线上环境地址
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(config).forEach((key) => {
    config[key as Key] = window.location.origin
  })
}
export default Object.freeze(config)
```

编辑主应用的`.umirc.ts`或`config/config.ts`文件，新增如下路由

```ts
export default defineConfig({
  routes: [
    { path: '/sub-react-app', component: 'sub-react-app', name: 'Sub-React-App' },
    { path: '/vue-cli-app', component: 'vue-cli-app', name: 'Vue-Cli-App' },
    { path: '/vite-vue-app', component: 'vite-vue-app', name: 'Vite-Vue-App' },
    { path: '/vite-svelte-app', component: 'vite-svelte-app', name: 'Vite-Svelte-App' },
  ],
})
```

::: code-group

```tsx [sub-react-app.tsx]
import config from '../utils/childAppConfig'
export default function SubReactApp() {
  return (
    <div>
      <micro-app name="sub-react-app" url={config['sub-react-app']}></micro-app>
    </div>
  )
}
```

```tsx [vue-cli-app.tsx]
import config from '../utils/childAppConfig'
export default function VueCliApp() {
  return (
    <div>
      <micro-app name="vue-cli-app" url={config['vue-cli-app']}></micro-app>
    </div>
  )
}
```

```tsx [vite-vue-app.tsx]
import config from '../utils/childAppConfig'
export default function ViteVueApp() {
  return (
    <div>
      <micro-app name="vite-vue-app" url={config['vite-vue-app']} iframe></micro-app>
    </div>
  )
}
```

```tsx [vite-svelte-app.tsx]
import config from '../utils/childAppConfig'
export default function ViteSvelteApp() {
  return (
    <div>
      <micro-app name="vite-svelte-app" url={config['vite-svelte-app']} iframe></micro-app>
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

同一种主应用框架中的每一个`<micro-app>`挂载点的生命周期事件写法都是一样的，所以这里以 `sub-react-app.tsx` 为例

```tsx [sub-react-app.tsx]
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
        name="sub-react-app"
        url={config['sub-react-app']}
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
  type AnyObj = Record<string, unknown>
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
  type AnyObj = Record<string, unknown>
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
  type AnyObj = Record<string, unknown>
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
  type AnyObj = Record<string, unknown>
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

#### sub-react-app

::: code-group

```tsx [sub-react-app.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function SubReactApp() {
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()
  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData('sub-react-app', { data: `来自基座的数据 ${+new Date()}` })
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
        name="sub-react-app"
        url={config['sub-react-app']}
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

#### vue-cli-app

子应用② 演示了关闭虚拟路由并从基座获取基础路由，更详细的说明[参考官方文档](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/router)

::: code-group

```tsx [vue-cli-app.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function VueCliApp() {
  // 操作子应用的路由
  const controlChildRouter = () => {
    microApp.router.push({ name: 'vue-cli-app', path: '/about' })
  }
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Button type="primary" onClick={controlChildRouter}>
          打开子应用About页面
        </Button>
      </Space>
      <micro-app
        name="vue-cli-app"
        url={config['vue-cli-app']}
        baseroute="/vue-cli-app"
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

#### vite-vue-app

::: code-group

```tsx [vite-vue-app.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function ViteVueApp() {
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()
  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData('vite-vue-app', { data: `来自基座的数据 ${+new Date()}` })
  }
  // 操作子应用的路由
  const controlChildRouter = () => {
    microApp.router.push({ name: 'vite-vue-app', path: '/about' })
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
        name="vite-vue-app"
        url={config['vite-vue-app']}
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

#### vite-svelte-app

::: code-group

```tsx [vite-svelte-app.tsx]
// ...
import microApp from '@micro-zoe/micro-app'
export default function ViteSvelteApp() {
  const [msg, setMsg] = useState('来自基座的初始数据')
  const [childMsg, setChildMsg] = useState()
  // 获取子应用发送过来的数据
  const onDataChange = (e: CustomEvent) => {
    setChildMsg(e.detail.data)
  }
  // 手动发送数据给子应用,第二个参数只接受对象类型
  const sendData = () => {
    microApp.setData('vite-svelte-app', { data: `来自基座的数据 ${+new Date()}` })
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
        name="vite-svelte-app"
        url={config['vite-svelte-app']}
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
