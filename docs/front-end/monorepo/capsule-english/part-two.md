## 目录结构

目录结构的规划大致如下

```
├── assets                    静态资源
├── components                公共组件
├── composables               放置自动导入方法
├── config                    配置文件
├── constants                 常量配置
├── lang                      i18n国际化
├── layouts                   布局组件
├── libs                      公共方法及工具方法
├── middleware                路由中间件
├── pages                     页面
├── plugins                   插件
├── public                    也是静态资源,但不会被编译
├── server
│   ├── api                   服务端API
│   └── middleware            服务端中间件
├── store                     状态管理
├── app.vue                   根组件
├── nuxt.config.ts            Nuxt3配置文件
├── tailwindcss.config.js     tailwind配置文件
├── i18n.config.ts            i18n国际化配置文件
├── .env                      环境变量文件
```

## 配置Nuxt3

安装一些好用的`Nuxt3`模块

```sh
pnpm add -D -F client @vueuse/nuxt @pinia/nuxt @pinia-plugin-persistedstate/nuxt @nuxtjs/i18n @nuxtjs/tailwindcss
```

其他有用的包和插件

```sh
# 安装到主项目
pnpm add -wD prettier-plugin-tailwindcss postcss
# 安装到Nuxt3开发依赖
pnpm add -D -F client daisyui vue-tsc clsx tailwind-merge tailwindcss-debug-screens
pnpm add -D -F client @iconify/tailwind @iconify-json/logos @iconify-json/carbon
# 安装到Nuxt3生产依赖
pnpm add -F client axios dayjs floating-vue
```

:::tip ✨提示
这里的`-F`是`--filter`的缩写，它们都是`pnpm`的参数，表示把依赖安装到`client`项目下，一般用在主项目根目录下。如果直接进入到`client`项目目录进行安装的话就不需要`-F`参数了
:::

编辑`apps/client/nuxt.config.ts`，添加如下配置，注册刚才安装的`Nuxt3`模块

```ts
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt', // [!code ++]
    '@pinia/nuxt', // [!code ++]
    '@pinia-plugin-persistedstate/nuxt', // [!code ++]
    'floating-vue/nuxt', // [!code ++]
    '@nuxtjs/i18n', // [!code ++]
    '@nuxtjs/tailwindcss', // [!code ++]
  ],
})
```

编辑主项目根目录的`.prettierrc`，添加 Tailwind 的类排序插件

```json
{
  // ...
  "plugins": ["prettier-plugin-tailwindcss"] // [!code ++]
}
```

## 环境变量

参考我另一篇关于[Nuxt3的笔记](../../engineering/nuxt.md#环境变量)

但这次因为是属于`monorepo`项目，我把环境变量文件放到主项目中进行统一管理(_当然也能分别放到各子项目中单独管理，根据自己的项目情况进行安排_)

在`client`项目中新建`config/env.ts`文件，编写几个用于读取主项目环境变量文件的方法。参考代码如下

```ts
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

/**
 * 尝试读取文件
 * @param file 文件路径
 * @returns
 */
export function tryStatSync(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {}
}

/**
 * 根据运行环境不同拿到对应的文件列表
 * @param mode 环境变量模式
 * @returns
 */
export function getEnvFiles(mode: string) {
  return mode === 'production'
    ? ['.env.production.local', '.env.production']
    : [
        /** default file */ `.env`,
        /** local file */ `.env.local`,
        /** mode file */ `.env.${mode}`,
        /** mode local file */ `.env.${mode}.local`,
      ]
}

/**
 * 读取环境变量
 * @param mode 环境变量模式
 * @param dir 相对主项目根目录的路径
 * @returns
 */
export function loadEnv(mode: string, dir: string) {
  const envFiles = getEnvFiles(mode)
  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      const filePath = path.resolve(process.cwd(), dir, file)
      if (!tryStatSync(filePath)?.isFile()) return []
      return Object.entries(dotenv.parse(fs.readFileSync(filePath)))
    })
  )
  return parsed
}
```

接着编辑`nuxt.config.ts`

```ts
import { loadEnv } from './config' // [!code ++]

const config = loadEnv(process.env.NODE_ENV as string, '../../') // [!code ++]
export default defineNuxtConfig({
  // ...
})
```

## 初始化Tailwind

```sh
pnpm dlx tailwindcss init
```

编辑`client`项目的`nuxt.config.ts`，添加如下配置

```ts
export default defineNuxtConfig({
  // ...
  postcss: {
    plugins: {
      tailwindcss: {}, // [!code ++]
      autoprefixer: {}, // [!code ++]
    },
  },
})
```

在`client`项目中新建`assets/css/tailwind.css`文件，填入如下内容

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

编辑`client`项目的`tailwind.config.js`，添加如下配置

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,jsx,tsx}',
    './layouts/**/*.{vue,jsx,tsx}',
    './pages/**/*.{vue,jsx,tsx}',
    './plugins/**/*.{js,ts}',
    './app.{vue,jsx,tsx}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    debugScreens: {
      position: ['bottom', 'right'],
      ignore: ['dark'],
    },
    extend: {},
  },
  corePlugins: {
    /** @see https://www.tailwindcss.cn/docs/preflight 重置浏览器样式 */
    preflight: true,
  },
  plugins: [
    // 监控屏幕尺寸的debug插件
    process.env.NODE_ENV === 'development' && require('tailwindcss-debug-screens'),
    // 注册UI组件库插件
    require('daisyui'),
    // svg图标组件库插件
    require('@iconify/tailwind').addDynamicIconSelectors(),
  ],
}
```

## i18n

编辑`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  // ...
  i18n: {
    defaultLocale: 'zh', // [!code ++]
    locales: ['zh', 'en'], // [!code ++]
    vueI18n: './i18n.config.ts', // [!code ++]
  },
})
```

在`client`项目中新建`i18n.config.ts`，根据自己的情况添加语言配置

```ts
import en from './lang/en.json'
import zh from './lang/zh.json'
export default defineI18nConfig(() => ({
  legacy: false, // 是否兼容之前
  fallbackLocale: 'zh', // 区配不到的语言就用zh
  messages: { en, zh },
}))
```

## 安装Logto

```sh
pnpm add -F client @logto/nuxt
```

编辑`nuxt.config.ts`，注册 Logto

```ts{7-17}
export default defineNuxtConfig({
  modules: [
    // ...
    '@logto/nuxt', // [!code ++]
  ],
  runtimeConfig: {
    logto: {
      endpoint: config.LOGTO_ENDPOINT,
      appId: config.NUXT_LOGTO_APP_ID,
      appSecret: config.NUXT_LOGTO_APP_SECRET,
      cookieEncryptionKey: config.NUXT_LOGTO_COOKIE_ENCRYPTION_KEY,
      pathnames: {
        signIn: config.NUXT_LOGTO_PATHNAMES_SIGN_IN,
        signOut: config.NUXT_LOGTO_PATHNAMES_SIGN_OUT,
        callback: config.NUXT_LOGTO_PATHNAMES_CALLBACK,
      },
    },
  },
})
```

上面的几个环境变量对应的值为

```ini
LOGTO_ENDPOINT=http://localhost:5001/
NUXT_LOGTO_APP_ID=l9pj4cqwl9wi2f66q0979
NUXT_LOGTO_APP_SECRET=iyTB7rwSNcYUwuRLiHrPQNZ4ycRZuLV3
NUXT_LOGTO_COOKIE_ENCRYPTION_KEY=wlstRAtXj9GX80MJyY4QXmaUjlX7HP8T
NUXT_LOGTO_PATHNAMES_SIGN_IN=/logto/sign-in
NUXT_LOGTO_PATHNAMES_SIGN_OUT=/logto/sign-out
NUXT_LOGTO_PATHNAMES_CALLBACK=/logto/callback
```

其中`/logto/sign-in`、`/logto/sign-out`和`/logto/callback`这三个服务端路由是在注册`@logto/nuxt`模块后自动生成的，而且默认也没有前缀`/logto`，我自己给加上去是为了区别其他路由而已
