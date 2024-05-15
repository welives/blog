---
title: uni-app工程搭建
head:
  - - meta
    - name: description
      content: uni-app工程搭建
  - - meta
    - name: keywords
      content: uniapp uni-app typescript vite vue3 pinia pinia-plugin-persistedstate 持久化 axios axios适配器 mock 路由权限 pnpm 工程化
---

::: tip ✨
搭建一个开箱即用的基于 uniapp + Vue3 + Pinia + TailwindCSS + TypeScript 的工程

[本工程的Github地址](https://github.com/welives/uni-app-starter)
:::

## 相关文档

- [Vue](https://cn.vuejs.org/guide/introduction.html)
- [uni-app](https://zh.uniapp.dcloud.io/quickstart-cli.html)
- [Vant-Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)
- [Pinia](https://pinia.vuejs.org/zh/)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import#readme)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [weapp-tailwindcss](https://weapp-tw.icebreaker.top/docs/intro)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 项目初始化

```sh
npx degit dcloudio/uni-preset-vue#vite-ts uni-app-starter
cd uni-app-starter
git init
```

这里就创建好一个基于 Vite 脚手架的`uni-app`工程了

### 版本更新

由于拉下来的模板所使用的`uni-app`依赖可能不是最新的版本，所以需要更新一下

```sh
npx @dcloudio/uvm@latest
```

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

:::: details ~~这个方案废弃，因为有大佬做了个整合插件，看下面~~

- **安装ESLint**

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

- **安装Vue3的ESLint整合插件**

由于整合插件内已经包含有`@typescript-eslint/eslint-plugin`和`@typescript-eslint/parser`，所以先卸载掉项目中的

```sh
pnpm rm @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D @vue/eslint-config-typescript @vue/eslint-config-prettier
```

- **ESLint和Prettier的忽略文件**

新建`.eslintignore`和`.prettierignore`文件，填入自己喜欢的配置

::: code-group

```ini [.eslintignore]
node_modules
dist
```

```ini [.prettierignore]
node_modules
dist
```

:::

- **`.eslintrc.js`配置文件**

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
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
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

::::

:::: tip ✨新方案，直接使用[Nuxt团队Anthony Fu大佬的eslint-config](https://github.com/antfu/eslint-config)

```sh
pnpm dlx @antfu/eslint-config@latest
```

![](./assets/uniapp/eslint-config.png)

编辑`eslint.config.mjs`，覆盖规则解决在`uniapp`里面驼峰命名组件无效的问题

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**'],
  formatters: true,
  typescript: true,
  vue: {
    overrides: {
      'vue/component-name-in-template-casing': ['off'],
    },
  },
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

::::

## 路径别名

编辑`vite.config.ts`

```ts
import { fileURLToPath, URL } from 'node:url' // [!code ++]
export default defineConfig(({ mode }) => {
  return {
    // ...
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // [!code ++]
      },
    },
  }
}
```

## 环境变量

```sh
pnpm add -D cross-env
```

关于 Vite 的环境变量详细文档[看这里](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

根目录新建`.env`文件，填入项目所需的环境变量。注意，环境变量名必须以`VITE_`开头，否则不会被识别，例如

```ini
VITE_APP_NAME=uni-app-starter
VITE_APP_HOST=localhost
VITE_APP_PORT=8080
API_HOST=http://localhost
API_PORT=8080
VITE_BASE_API=$API_HOST:$API_PORT
```

如果想把环境变量注入到业务中成为一个常量，那么可以这样做。编辑`vite.config.ts`

```ts
export default defineConfig(({ mode }) => {
  return {
    // ... // [!code focus:4]
    define: {
      UNI_PLATFORM: JSON.stringify(process.env.UNI_PLATFORM),
    },
  }
})
```

编辑`src/env.d.ts`，给自定义的环境变量或注入常量添加类型

```ts
// ...
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_HOST: string
  readonly VITE_APP_PORT: string
  readonly VITE_BASE_API: string
  // 更多环境变量...
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const UNI_PLATFORM: string
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
  const PORT = parseInt(env.VITE_APP_PORT) // [!code ++]
  return {
    server: {
      port: isNaN(PORT) ? undefined : PORT, // [!code ++]
    },
    // ...
  }
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
        imports: ['vue', 'uni-app', 'pinia'],
        eslintrc: {
          enabled: true,
        },
        dts: true,
      }),
    ],
  }
})
```

编辑`tsconfig.json`，将插件生成的`auto-imports.d.ts`添加进`include`字段

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

## 安装TailwindCSS

```sh
pnpm add -D tailwindcss postcss autoprefixer sass postcss-rem-to-responsive-pixel weapp-tailwindcss
npx tailwindcss init -p
npx weapp-tw patch
```

根目录新建`platform.js`，填入以下内容

```js
const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'
const WeappTailwindcssDisabled = isH5 || isApp
module.exports = {
  isH5,
  isApp,
  WeappTailwindcssDisabled,
}
```

编辑`src/App.vue`、`package.json`、`tailwind.config.js`和`postcss.config.js`和`vite.config.ts`

::: code-group

```vue [App.vue]
// ...
<style lang="scss">
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
```

```json [package.json]
{
  "scripts": {
    // ...
    "postinstall": "weapp-tw patch" // [!code ++]
  }
}
```

```js [tailwind.config.js]
const cssMacro = require('weapp-tailwindcss/css-macro')
const colors = require('tailwindcss/colors')
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', "'./src/**/*.{html,jsx,tsx,vue}'"],
  theme: {
    extend: { colors },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    cssMacro({
      variantsMap: {
        wx: 'MP-WEIXIN',
        '-wx': {
          value: 'MP-WEIXIN',
          negative: true,
        },
      },
    }),
  ],
}
```

```js [postcss.config.js]
const { WeappTailwindcssDisabled } = require('./platform')
module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer')(),
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32, // 1rem = 32rpx
      propList: ['*'], // 默认所有属性都转化
      transformUnit: 'rpx', // 转化的单位,可以变成 px / rpx
      disabled: WeappTailwindcssDisabled, // v6版本新增的参数,用来禁止插件的转化
    }),
    require('weapp-tailwindcss/css-macro/postcss'),
  ],
}
```

```ts [vite.config.ts]
// ...
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import { WeappTailwindcssDisabled } from './platform'
import { plugins as postcssPlugins } from './postcss.config'
export default defineConfig(({ mode }) => {
  return {
    // ...
    plugins: [uni(), uvwt({ disabled: WeappTailwindcssDisabled })],
    // 内联 postcss 注册 tailwindcss
    css: {
      postcss: {
        plugins: postcssPlugins,
      },
    },
  }
})
```

:::

## 助手函数

新建`src/libs/utils.ts`，封装一些辅助函数，具体代码参考我的[助手函数封装](../encapsulation.md#helper)

## 请求模块

```sh
pnpm add axios
```

新建`src/api/core/http.ts`和`src/api/core/config.ts`，之后的封装逻辑参考我的[Axios封装](../encapsulation.md#axios)

### Mock

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

根目录新建`mock/index.ts`，示例如下，根据自己的情况添加接口

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

## axios适配器

默认情况下`axios`无法在小程序中正常使用，若坚持要用到话需要一个适配器进行转换

此适配器的逻辑参考自[@uni-helper/axios-adapter](https://www.npmjs.com/package/@uni-helper/axios-adapter)，并修复了一些bug

新建`src/api/adapter`目录，用来存放适配器相关的逻辑文件

### ①扩展axios的类型

新建`src/api/adapter/types.d.ts`，并添加如下代码

::: details 查看

```ts
import type { AxiosPromise, AxiosRequestConfig } from 'axios'
declare module 'axios' {
  interface AxiosRequestConfig
    extends Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete' | 'header'>,
      Omit<UniApp.UploadFileOption, 'success' | 'fail' | 'complete' | 'header' | 'formData'>,
      Omit<UniApp.DownloadFileOption, 'success' | 'fail' | 'complete' | 'header'>,
      Partial<Pick<UniApp.RequestTask, 'onHeadersReceived'>> {}
  interface AxiosResponse {
    cookies?: string[]
  }
  interface Axios {
    upload<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    download<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
  }
}
export interface AdapterMethod {
  (config: AxiosRequestConfig): AxiosPromise
}
export type UniNetworkRequestWithoutCallback =
  | Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'>
  | Omit<UniApp.DownloadFileOption, 'success' | 'fail' | 'complete'>
  | Omit<UniApp.UploadFileOption, 'success' | 'fail' | 'complete'>
```

:::

### ②工具函数

新建`src/api/adapter/utils.ts`，并添加如下代码
::: details 查看

```ts
// @ts-expect-error
import buildURL from 'axios/unsafe/helpers/buildURL'
// @ts-expect-error
import buildFullPath from 'axios/unsafe/core/buildFullPath'
// @ts-expect-error ignore
import speedometer from 'axios/unsafe/helpers/speedometer'
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { AxiosHeaders } from 'axios'
import type { UniNetworkRequestWithoutCallback } from './types'

interface AnyObj {
  [key: string]: any
}

type UniProgressResult = UniApp.OnProgressDownloadResult | UniApp.OnProgressUpdateResult

/**
 * @description 返回可选值存在的配置
 */
function mergeKeys(keys: string[], configObj: AnyObj) {
  let config: AnyObj = {}
  keys.forEach((key) => {
    if (typeof key !== 'undefined') {
      config[key] = configObj[key]
    }
  })
  return config
}

/**
 * @description 整理 uniapp 的请求参数
 */
export function resolveUniAppRequestOptions(
  config: AxiosRequestConfig
): UniNetworkRequestWithoutCallback {
  const responseType = config.responseType === 'arraybuffer' ? 'arraybuffer' : 'text'
  const dataType = responseType === 'text' ? 'json' : void 0
  const { headers, baseURL, data, ...restConfig } = config
  // 格式化一下
  const requestHeaders = AxiosHeaders.from(headers as any).normalize(false)
  if (config.auth) {
    const username = config.auth.username || ''
    const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : ''
    requestHeaders.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`)
  }
  // 拼接完整URL
  const fullPath = buildFullPath(baseURL, config.url)
  const method = (config.method?.toUpperCase() ?? 'GET') as unknown as any
  // 拼接参数
  const url = buildURL(fullPath, config.params, config.paramsSerializer)
  const timeout = config.timeout || 60000
  // 上传相关
  let uploadData: AnyObj = {}
  if (method === 'UPLOAD' && data && typeof data === 'string') {
    const optionalKeys = [
      // #ifdef APP-PLUS || H5
      'files',
      // #endif
      // #ifdef MP-ALIPAY
      'fileType',
      // #endif
      // #ifdef H5
      'file',
      // #endif
      'filePath',
      'name',
    ]
    const parsed = JSON.parse(data)
    const formData: AnyObj = {}
    if (parsed !== null && typeof parsed === 'object') {
      uploadData = mergeKeys(optionalKeys, parsed)
      for (const [key, value] of Object.entries(parsed)) {
        if (!optionalKeys.includes(key)) {
          formData[key] = value
        }
      }
      if (Object.keys(uploadData).filter((k) => uploadData[k]).length === 0) {
        throw new Error('上传对象不能为空')
      }
      uploadData['formData'] = formData
    }
  }

  return {
    ...restConfig,
    url,
    header: requestHeaders.toJSON(), // uni-app要求header是一个plainObject,所以转成json对象
    method,
    responseType,
    dataType,
    timeout,
    ...(method === 'UPLOAD' ? uploadData : { data }),
  }
}

/**
 * @description 进度变化处理
 * @see https://github.com/axios/axios/blob/7d45ab2e2ad6e59f5475e39afd4b286b1f393fc0/lib/adapters/xhr.js#L17-L44
 */
export function progressEventReducer(
  listener: (progressEvent: AxiosProgressEvent) => void,
  isDownloadStream: boolean
) {
  let bytesNotified = 0
  const _speedometer = speedometer(50, 250)

  return (result: UniProgressResult) => {
    // @ts-expect-error
    const loaded = isDownloadStream ? result.totalBytesWritten : result.totalBytesSent
    // @ts-expect-error
    const total = isDownloadStream
      ? result.totalBytesExpectedToWrite
      : result.totalBytesExpectedToSend
    const progressBytes = loaded - bytesNotified
    const rate = _speedometer(progressBytes)
    const inRange = loaded <= total

    bytesNotified = loaded

    const data: AxiosProgressEvent = {
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      bytes: progressBytes,
      rate: rate || undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: result,
    }
    data[isDownloadStream ? 'download' : 'upload'] = true
    listener(data)
  }
}
```

:::

### ③取消请求代理函数

因为需要保留`axios`的取消请求用法，而`uni-app`的`requestTask`并不会对外暴露，所以需要一个中间函数来进行代理

新建`src/api/adapter/methods/cancel.ts`，并添加如下代码

::: details 查看

```ts
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { CanceledError } from 'axios'

/**
 * @description 用来代理操作uni-app的requestTask
 */
export default class Canceled<T> {
  private readonly config: AxiosRequestConfig<T>
  private onCanceled?: (cancelEvent?: any) => void
  constructor(config: AxiosRequestConfig<T>) {
    this.config = config
  }
  subscribe(task: any, reject: Function) {
    if (this.config.cancelToken || this.config.signal) {
      // ① ⚡注册取消事件函数, cancelEvent是从axios那里传递过来的
      this.onCanceled = (cancelEvent?: any) => {
        if (!task) return
        // ③ ⚡当axios请求被取消时才会触发这个事件函数
        reject(
          !cancelEvent || cancelEvent.type
            ? new CanceledError(void 0, void 0, this.config as InternalAxiosRequestConfig, task)
            : cancelEvent
        )
        task.abort()
        task = null
      }
      if (this.config.cancelToken) {
        // @ts-expect-error
        this.config.cancelToken?.subscribe(this.onCanceled) // ② ⚡订阅取消事件函数, 底层是保存在cancelToken的 _listeners
      }
      if (this.config.signal && this.config.signal.addEventListener) {
        this.config.signal.aborted
          ? this.onCanceled()
          : this.config.signal.addEventListener('abort', this.onCanceled)
      }
    }
  }
  unsubscribe() {
    if (this.config.cancelToken) {
      // @ts-expect-error
      this.config.cancelToken?.unsubscribe(this.onCanceled)
    }
    if (this.config.signal && this.config.signal.removeEventListener) {
      this.config.signal.removeEventListener('abort', this.onCanceled)
    }
  }
}
```

:::

### ④封装uni-app的请求API

因为`uni-app`的网络请求、上传和下载其实就只有`3`个API，那么可以用三个方法来分别封装一下

在`src/api/adapter/methods`目录下新建`request.ts`、`download.ts`和`upload.ts`文件，它们和`uni-app`的API对应关系如下

- `request.ts` => `uni.request`
- `download.ts` => `uni.downloadFile`
- `upload.ts` => `uni.uploadFile`

::: details 查看
::: code-group

```ts [request.ts]
// @ts-expect-error
import settle from 'axios/unsafe/core/settle'
import { AxiosError, AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { resolveUniAppRequestOptions } from '../utils'
import type { AdapterMethod } from '../types'
import Canceled from './cancel'

const request: AdapterMethod = (config) => {
  const requestOptions = resolveUniAppRequestOptions(config)
  const responseConfig = config as InternalAxiosRequestConfig
  responseConfig.headers = new AxiosHeaders(requestOptions.header)
  const onCancel = new Canceled(config)
  return new Promise((resolve, reject) => {
    const success = (result: UniApp.RequestSuccessCallbackResult) => {
      if (!task) return
      const headers = new AxiosHeaders(result.header)
      const response = {
        config: responseConfig,
        headers,
        data: result.data,
        status: result.statusCode,
        statusText: result.errMsg ?? 'OK',
        request: task,
        cookies: result.cookies,
      }
      settle(resolve, reject, response)
    }
    const fail = (error: UniApp.GeneralCallbackResult) => {
      const { errMsg = '' } = error ?? {}
      if (errMsg) {
        const isTimeoutError = errMsg === 'request:fail timeout'
        const isNetworkError = errMsg === 'request:fail'
        if (isTimeoutError)
          reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task))
        if (isNetworkError)
          reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task))
      }
      reject(new AxiosError(error.errMsg, undefined, responseConfig, task))
    }
    let task: UniApp.RequestTask | null = uni.request({
      ...requestOptions,
      success,
      fail,
      complete() {
        onCancel.unsubscribe()
        task = null
      },
    })
    if (typeof config.onHeadersReceived === 'function')
      task.onHeadersReceived(config.onHeadersReceived)
    onCancel.subscribe(task, reject)
  })
}
export default request
```

```ts [download.ts]
// @ts-expect-error
import settle from 'axios/unsafe/core/settle'
import { AxiosError, AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { AdapterMethod } from '../types'
import { progressEventReducer, resolveUniAppRequestOptions } from '../utils'
import Canceled from './cancel'

const download: AdapterMethod = (config) => {
  const requestOptions = resolveUniAppRequestOptions(config)
  const responseConfig = config as InternalAxiosRequestConfig
  responseConfig.headers = new AxiosHeaders(requestOptions.header)
  const onCancel = new Canceled(config)
  return new Promise((resolve, reject) => {
    const success = (result: UniApp.DownloadSuccessData) => {
      if (!task) return
      const response = {
        config: responseConfig,
        data: result.tempFilePath,
        status: result.statusCode,
        statusText: result.errMsg ?? 'OK',
        request: task,
      }
      settle(resolve, reject, response)
    }
    const fail = (error: any) => {
      const { errMsg = '' } = error ?? {}
      if (errMsg) {
        const isTimeoutError = errMsg === 'downloadFile:fail timeout'
        const isNetworkError = errMsg === 'downloadFile:fail'
        if (isTimeoutError)
          reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task))
        if (isNetworkError)
          reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task))
      }
      reject(new AxiosError(error.errMsg, undefined, responseConfig, task))
    }
    let task: UniApp.DownloadTask | null = uni.downloadFile({
      ...requestOptions,
      success,
      fail,
      complete() {
        onCancel.unsubscribe()
        task = null
      },
    })
    if (typeof config.onDownloadProgress === 'function')
      task.onProgressUpdate(progressEventReducer(config.onDownloadProgress, true))
    if (typeof config.onHeadersReceived === 'function')
      task.onHeadersReceived(config.onHeadersReceived)
    onCancel.subscribe(task, reject)
  })
}
export default download
```

```ts [upload.ts]
// @ts-expect-error
import settle from 'axios/unsafe/core/settle'
import { AxiosError, AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { AdapterMethod } from '../types'
import { progressEventReducer, resolveUniAppRequestOptions } from '../utils'
import Canceled from './cancel'

const upload: AdapterMethod = (config) => {
  const requestOptions = resolveUniAppRequestOptions(config)
  const responseConfig = config as InternalAxiosRequestConfig
  responseConfig.headers = new AxiosHeaders(requestOptions.header)
  const onCancel = new Canceled(config)
  return new Promise((resolve, reject) => {
    const success = (result: UniApp.UploadFileSuccessCallbackResult) => {
      if (!task) return
      const response = {
        config: responseConfig,
        headers: {},
        data: result.data,
        status: result.statusCode,
        statusText: result.errMsg ?? 'OK',
        request: task,
      }
      settle(resolve, reject, response)
    }
    const fail = (error: UniApp.GeneralCallbackResult) => {
      const { errMsg = '' } = error ?? {}
      if (errMsg) {
        const isTimeoutError = errMsg === 'uploadFile:fail timeout'
        const isNetworkError = errMsg === 'uploadFile:fail file error'
        if (isTimeoutError)
          reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task))
        if (isNetworkError)
          reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task))
      }
      reject(new AxiosError(error.errMsg, undefined, responseConfig, task))
    }
    let task: UniApp.UploadTask | null = uni.uploadFile({
      ...requestOptions,
      success,
      fail,
      complete() {
        onCancel.unsubscribe()
        task = null
      },
    })
    if (typeof config.onUploadProgress === 'function')
      task.onProgressUpdate(progressEventReducer(config.onUploadProgress, false))
    if (typeof config.onHeadersReceived === 'function')
      task.onHeadersReceived(config.onHeadersReceived)
    onCancel.subscribe(task, reject)
  })
}
export default upload
```

:::

创建一个中间函数，根据请求的`method`来统一管理这三个封装好的请求

新建`src/api/adapter/methods/index.ts`，并添加如下代码

```ts
import type { AxiosRequestConfig } from 'axios'
import type { AdapterMethod } from '../types'
import request from './request'
import download from './download'
import upload from './upload'

/**
 * @description 获取适配器的请求方法
 */
export function getMethod(config: AxiosRequestConfig): AdapterMethod {
  const { method: rawMethod = 'GET' } = config
  const method = rawMethod.toLocaleLowerCase()
  switch (method) {
    case 'download':
      return download
    case 'upload':
      return upload
    default:
      return request
  }
}
```

### ⑤适配器的构造器

在**第④步**中可以看到`method`的值可能为`download`和`upload`，这是因为通过原型给`axios`扩展了两个方法用来分别处理上传和下载

新建`src/api/adapter/index.ts`，并添加如下代码

```ts
import type { AxiosRequestConfig, AxiosAdapter, AxiosResponse } from 'axios'
import { Axios } from 'axios'
import { getMethod } from './methods'
export { AxiosRequestConfig, AxiosResponse }
/**
 * @description axios适配器的构造器
 */
export function createUniAppAxiosAdapter(): AxiosAdapter {
  if (!uni) {
    throw new Error('这个适配器只能在uni-app环境中使用')
  }
  // 通过原型扩展此插件特有的方法
  Axios.prototype.upload = function (url, data, config) {
    return this.request({ ...config, url, data, method: 'upload' })
  }
  Axios.prototype.download = function (url, config) {
    return this.request({ ...config, url, method: 'download' })
  }
  const uniappAdapter = (config: AxiosRequestConfig) => {
    const method = getMethod(config)
    return method(config)
  }
  return uniappAdapter
}
export default createUniAppAxiosAdapter
```

### ⑥适配器注册

编辑上面封装好的请求模块的`http.ts`文件

```ts
// ...
import uniappAdapter from '../adapter' // [!code ++]
class AxiosRequest {
  private config: RequestConfig = {
    // ...
    adapter: uniappAdapter(), // [!code ++]
  }
  upload: IUpload = (url: string, data, opts = {}) => {
    // #ifdef H5 // [!code ++]
    opts.headers = opts.headers ?? { 'Content-Type': 'multipart/form-data' }
    // #endif // [!code ++]
    // ...
    return new Promise((resolve, reject) => {
      this.service
        .upload(url, data, opts) // [!code ++]
        .then((res) => {
          // ...
        })
        .catch((error) => {
          // ...
        })
    })
  }
  download: IRequest = (url: string, opts = {}) => {
    // ...
    return new Promise((resolve, reject) => {
      this.service
        .download(url, opts) // [!code ++]
        .then((res) => {
          // ...
        })
        .catch((error) => {
          // ...
        })
    })
  }
}
```

编辑`src/api/core/config.ts`

```ts
// ...
const requestConfig: RequestConfig<ResponseStructure> = {
  // ...
  responseInterceptors: [
    (response) => {
      // ... // [!code focus:11]
      if (config.method === 'download') {
        // TODO
        return response // [!code ++]
      } else if (config.method === 'upload') {
        // TODO
        return response // [!code ++]
      } else if (!data.success) {
        // TODO
        requestConfig.errorConfig?.errorThrower?.(data)
      }
      return response
    },
  ],
}
```

### ⑦Blob和FormData的兼容

由于小程序没有`Blob`和`FormData`对象, 需要自定义一个`vite`插件来兼容

```sh
pnpm add local-pkg miniprogram-blob miniprogram-formdata miniprogram-file miniprogram-text-encoder miniprogram-text-decoder
```

编辑`vite.config.ts`

```ts
import { isPackageExists } from 'local-pkg' // [!code ++]
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      // ...
      axiosAdapterPlugin(), // [!code ++]
    ],
  }
})
function axiosAdapterPlugin() {
  const hasFormDataPolyfill = isPackageExists('miniprogram-formdata')
  const hasBlobPolyfill = isPackageExists('miniprogram-blob')
  return {
    name: 'vite-plugin-uni-axios',
    transform(code, id) {
      if (process.env.UNI_PLATFORM?.includes('mp')) {
        if (id.includes('/form-data/lib/browser.js')) {
          return {
            code: code.replace('window', 'globalThis'),
          }
        }
        if (id.includes('/axios/lib/platform/browser/classes/FormData.js')) {
          return {
            code: `${
              hasFormDataPolyfill
                ? "import FormData from 'miniprogram-formdata';"
                : 'class FormData {};'
            }export default FormData;`,
          }
        }
        if (id.includes('/axios/lib/platform/browser/classes/Blob.js')) {
          return {
            code: `${
              hasBlobPolyfill ? "import Blob from 'miniprogram-blob';" : 'class Blob {};'
            }export default Blob;`,
          }
        }
      }
    },
  }
}
```

### ⑧使用示例

::: code-group

```ts [request]
import { request } from '@/api'
const res = await request('/api/login', { method: 'post' })
```

```ts [download]
import { download } from '@/api'
const downloadImage = async () => {
  const url =
    UNI_PLATFORM === 'h5'
      ? '/api/unidoc/zh/uni-app.png'
      : 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-app.png'
  const res = await download(url, {
    onDownloadProgress: ({ loaded, total }) => {
      const progress = total ? (loaded / total) * 100 : 0
      console.log(`${progress.toFixed(2)}%`)
    },
  })
  imageSrc.value = res
}
```

```ts [upload]
import { upload } from '@/api'
uni.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album'],
  success: async (files) => {
    imageSrc.value = files.tempFilePaths[0]
    await upload(
      'https://unidemo.dcloud.net.cn/upload',
      { filePath: files.tempFilePaths[0], name: 'file' },
      {
        onUploadProgress: ({ loaded, total }) => {
          const progress = total ? (loaded / total) * 100 : 0
          console.log(`${progress.toFixed(2)}%`)
        },
      }
    )
    uni.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 1000,
    })
  },
})
```

:::

## 状态管理

这里用的是[Pinia](https://pinia.vuejs.org/zh/)，注意要用`2.0.36`的版本，最新的版本在`uni-app`中会报错，等待官方解决

```sh
pnpm add pinia@2.0.36
```

编辑`src/main.ts`，注册 Pinia

```ts
// ...
import { createPinia } from 'pinia' // [!code ++]
export function createApp() {
  const app = createSSRApp(App).use(createPinia()) // [!code ++]
  // ...
}
```

### 持久化

```sh
pnpm add pinia-plugin-persistedstate
```

编辑`src/main.ts`，注册持久化插件

```ts
// ...
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // [!code ++]
export function createApp() {
  const app = createSSRApp(App).use(createPinia().use(piniaPluginPersistedstate)) // [!code ++]
  // ...
}
```

新建`src/libs/storage.ts`和`src/stores/user.ts`

::: code-group

```ts [storage.ts]
import type { StorageLike } from 'pinia-plugin-persistedstate'
enum StorageSceneKey {
  USER = 'storage-user',
}

function getItem<T = any>(key: string): T {
  const value = uni.getStorageSync(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  uni.setStorageSync(key, JSON.stringify(value))
}
function removeItem(key: string) {
  uni.removeStorageSync(key)
}

/** @description 用来覆盖pinia持久化存储的方法 */
const piniaStorage: StorageLike = {
  getItem: (key) => {
    const value = uni.getStorageSync(key)
    return value ?? null
  },
  setItem: (key, value) => {
    uni.setStorageSync(key, value)
  },
}

export { getItem, setItem, removeItem, StorageSceneKey, piniaStorage }
```

```ts [user.ts]
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { StorageSceneKey, piniaStorage } from '../libs'

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
      storage: piniaStorage,
    },
  }
)
```

:::

## 路由权限

### ①路由状态

新建`src/stores/auth.ts`，用来记录重定向的信息，编辑`src/libs/storage.ts`，增加一个`pinia`持久化场景

::: code-group

```ts [auth.ts]
import { defineStore } from 'pinia'
import { StorageSceneKey, piniaStorage } from '../libs'

interface Redirect {
  url: string
  tab?: boolean
}
interface AuthState {
  redirect: Redirect | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ redirect: null }),
  actions: {
    setRedirect(value: Redirect) {
      this.redirect = value
    },
    clear() {
      this.redirect = null
    },
  },
  persist: {
    key: StorageSceneKey.AUTH,
    storage: piniaStorage,
  },
})
```

```ts [storage.ts]
enum StorageSceneKey {
  // ...
  AUTH = 'storage-auth', // [!code ++]
}
```

:::

### ②封装uni-app的路由跳转

原本是想用`URLSearchParams`来处理参数的，但`uni-app`没有像`Taro`那样做 polyfill 处理，所以改成使用`qs`模块对 URL 参数进行处理

注意要使用`6.5.3`版本，最新的版本在小程序中会报错

```sh
pnpm add qs@6.5.3
pnpm add -D @types/qs
```

新建`src/router/index.ts`，对`uni-app`的路由跳转做一层权限控制的封装

::: details 查看

```ts
import { stringify, parse } from 'qs'
import { useUserStore } from '../stores'
import { utils } from '../libs'

interface AnyObj {
  [key: string]: any
}
type RouterType = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack'
type UniAnimationType = Pick<UniApp.NavigateToOptions, 'animationType'> &
  Pick<UniApp.NavigateBackOptions, 'animationType'>
interface UniRouterOptions<S = any>
  extends Omit<UniApp.NavigateToOptions, 'success' | 'fail' | 'complete' | 'animationType'>,
    Omit<UniApp.NavigateBackOptions, 'success' | 'fail' | 'complete' | 'animationType'>,
    Omit<UniApp.RedirectToOptions, 'success' | 'fail' | 'complete'>,
    Omit<UniApp.ReLaunchOptions, 'success' | 'fail' | 'complete'>,
    Omit<UniApp.SwitchTabOptions, 'success' | 'fail' | 'complete'>,
    UniAnimationType {
  data?: string | AnyObj
  success?: (result: S) => void
  fail?: (result: any) => void
  complete?: (result: any) => void
}

function searchParams2Obj(params: any) {
  const searchParams = parse(params)
  const obj: AnyObj = {}
  for (const [key, value] of Object.entries(searchParams)) {
    obj[key] = value
  }
  return obj
}

/**
 * 检查权限
 */
function authCheck(urlKey: string, type: RouterType, options: UniRouterOptions) {
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
function navigate(type: RouterType, options: UniRouterOptions) {
  const { data, ...rest } = options
  if (!['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'].includes(type)) return
  if (!rest.url.startsWith('/')) {
    rest.url = `/${rest.url}`
  }
  // @ts-expect-error
  uni[type](rest)
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
  private middleware(type: RouterType, options: UniRouterOptions) {
    let { url = '', data = {}, events, ...rest } = options
    let [urlKey, queryStr] = url.split('?')
    // 单独存一份url,待会要用
    urlKey = urlKey
      .split('/')
      .filter((e) => e !== '')
      .join('/')
    try {
      if (type === 'navigateBack') {
        uni.navigateBack(rest)
      } else {
        if (!urlKey.trim() || !routes.includes(urlKey)) {
          throw Error('无效的路由')
        }
        if (type === 'switchTab') {
          url = urlKey
        } else {
          if (data && typeof data === 'string' && data.trim()) {
            data = searchParams2Obj(data)
          }
          let obj: AnyObj = {}
          if (queryStr && queryStr.trim()) {
            obj = searchParams2Obj(queryStr)
          }
          const str = stringify(utils.merge(data as object, obj))
          url = str ? `${urlKey}?${str}` : urlKey
        }
        authCheck(urlKey, type, { ...rest, url, events })
      }
    } catch (error: any) {
      // TODO
      console.error(error.message)
    }
  }
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  switchTab(options: UniRouterOptions) {
    this.middleware('switchTab', options)
  }
  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch(options: UniRouterOptions) {
    this.middleware('reLaunch', options)
  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
   */
  redirectTo(options: UniRouterOptions) {
    this.middleware('redirectTo', options)
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
   */
  navigateTo(options: UniRouterOptions<UniApp.NavigateToSuccessOptions>) {
    this.middleware('navigateTo', options)
  }
  /**
   * 关闭当前页面，返回上一页面或多级页面
   */
  navigateBack(options: Omit<UniRouterOptions, 'url'>) {
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

### ③权限钩子

新建`src/hooks/useAuth.ts`权限钩子函数，对直接访问 URL 的方式进行拦截

```ts
import { onShow } from '@dcloudio/uni-app'
import { useUserStore, useAuthStore } from '../stores'
import router from '../router'
const tabbar = ['pages/home/index', 'pages/profile/index']

export const useAuth = () => {
  const isLogged = useUserStore().isLogged
  const setRedirect = useAuthStore().setRedirect
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const isTab = tabbar.includes(current.route ?? '')
  // @ts-expect-error
  const fullPath = current.$page?.fullPath
  onShow(() => {
    if (!isLogged) {
      setRedirect({ tab: isTab, url: fullPath })
      router.reLaunch({ url: '/pages/index/index' })
    }
  })
}
```

### ④使用示例

新建三个页面`blank`、`home`和`profile`，把`blank`设置为应用启动页当作跳板，`home`和`profile`设置为`tabbar`，接着编辑`index`页面

::: code-group

```vue [blank]
<template></template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import router from '@/router'
const isLogged = useUserStore().isLogged
onLoad(() => {
  if (isLogged) {
    router.switchTab({ url: '/pages/home/index' })
  } else {
    router.reLaunch({ url: '/pages/index/index' })
  }
})
</script>
```

```vue [index]
<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <button class="my-3" @tap="login">Go Home</button>
  </view>
</template>

<script setup lang="ts">
import { request } from '@/api'
import { useUserStore, useAuthStore } from '@/stores'
import router from '@/router'
const setToken = useUserStore().setToken
const auth = useAuthStore()
const login = async () => {
  const res = await request('/api/login', { method: 'post' })
  setToken(res.data)
  if (auth.redirect?.url) {
    const success = () => {
      auth.clear()
    }
    auth.redirect.tab
      ? router.switchTab({
          url: auth.redirect.url,
          success,
        })
      : router.redirectTo({
          url: auth.redirect.url,
          success,
        })
  } else {
    router.switchTab({ url: '/pages/home/index' })
  }
}
</script>
```

```vue [home]
<template>
  <view class="flex flex-1 flex-wrap flex-col items-center justify-center gap-4 h-full">
    <text>Home Page</text>
    <view class="text-center">
      <button @tap="counter.decrement">Dec</button>
      <text>{{ counter.count }}</text>
      <button @tap="counter.increment">Inc</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAuth } from '@/hooks'
import { useCounterStore } from '@/stores'
useAuth()
const counter = useCounterStore()
</script>
```

:::

## UI框架

### 使用Vant

由于`Vant`没有针对`uni-app`做适配，所以这里以小程序端的[Vant-Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)为例

```sh
pnpm add @vant/weapp --production
```

新建`src/wxcomponents`，名字一定要是`wxcomponents`，否则无法识别`Vant-Weapp`

使用软链接的方式将`node_modules/@vant/weapp/dist`映射到`src/wxcomponents/vant-weapp`

```cmd
mklink /j "./src/wxcomponents/vant-weapp" "./node_modules/@vant/weapp/dist"
```

::: tip ⚡ 注意
`mklink`是`Windows`系统的 cmd 命令，删除软链接时使用`rmdir "./src/wxcomponents/vant-weapp"`

如果是`Linux`要用`ln -s ./src/wxcomponents/vant-weapp ./node_modules/@vant/weapp/dist`
:::

#### 引入组件

编辑`src/pages.json`，用到的组件在`globalStyle`的`usingComponents`字段中注册，然后就可以在 Vue 组件中使用了

详细的说明可以参考[uni-app的文档](https://zh.uniapp.dcloud.io/tutorial/miniprogram-subject.html)

```json
{
  "globalStyle": {
    // ...
    "usingComponents": {
      "van-button": "/wxcomponents/vant-weapp/button/index"
    }
  }
}
```

::: danger 💥 警告
`vant-weapp`仅支持微信小程序和 App，暂不支持 H5 和其他小程序
:::
