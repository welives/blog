---
title: 给VitePress增加图片缩放功能
---

默认的 Vitepress 加载图片后，因为布局的原因，图片显得很小，很多图片里的内容看不清晰,所以想要一个可以点击图片放大的效果

经过搜索，找到了一个方案[issues#854](https://github.com/vuejs/vitepress/issues/854)，看了他们的交流后，我也尝试实现了这个功能

## 安装`medium-zoom`

::: code-group

```sh [npm]
npm add medium-zoom
```

```sh [yarn]
yarn add medium-zoom
```

```sh [pnpm]
pnpm add medium-zoom
```

:::

## 引入库以及配置相关文件

### 方式一

在`docs/.vitepress`目录下新建`theme`文件夹，接着新建`index.ts`文件(_如果已有则忽略此步骤_)，具体代码如下

```ts{2-4,10-23}
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue' // [!code focus:3]
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './global.css'

export default {
  ...DefaultTheme,
  // [!code focus:15]
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 为所有图片增加缩放功能
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
```

这时候，点击图片放大的功能已经实现了,但是效果不尽如人意，会被其他层级的元素遮挡图片(_例如左侧的导航栏_),所以需要修改一下样式

```css
.medium-zoom-overlay {
  background-color: var(--vp-c-bg) !important;
  z-index: 100;
}

.medium-zoom-overlay ~ img {
  z-index: 101;
}

.medium-zoom--opened .medium-zoom-overlay {
  opacity: 0.9 !important;
}
```

### 方式二

在`docs/.vitepress`目录下新建`hooks`文件夹，接着新建`index.ts`和`useMediumZoom.ts`文件，具体代码如下

::: code-group

```ts [useMediumZoom.ts]
import mediumZoom from 'medium-zoom'
import { inject, nextTick, onMounted, watch } from 'vue'
import type { Zoom } from 'medium-zoom'
import type { App, InjectionKey } from 'vue'
import type { Router } from 'vitepress'

declare module 'medium-zoom' {
  interface Zoom {
    refresh: (selector?: string) => void
  }
}

export const mediumZoomSymbol: InjectionKey<Zoom> = Symbol('mediumZoom')

export function useMediumZoom() {
  onMounted(() => inject(mediumZoomSymbol)?.refresh())
}

export function useMediumZoomProvider(app: App, router: Router) {
  // 如果是TS项目, 必须要有`.vitepress/.env.d.ts`文件,否则这里会报错说 import.mata对象上没有env属性
  if (import.meta.env.SSR) return
  const zoom = mediumZoom()
  zoom.refresh = () => {
    zoom.detach()
    zoom.attach(':not(a) > img:not(.image-src)')
  }
  app.provide(mediumZoomSymbol, zoom)
  watch(
    () => router.route.path,
    () => nextTick(() => zoom.refresh())
  )
}
```

```ts [index.ts]
export * from './useMediumZoom'
```

:::

::: warning 注意
TS 项目必须要有`.vitepress/.env.d.ts`文件，否则报错说`import.mata`对象上没有`env`属性

```ts
/// <reference types="vite/client" />
```

:::

接着编辑**方式一**中提到的`theme/index.ts`文件

```ts{2-3,8-10}
import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress' // [!code ++]
import { useMediumZoomProvider } from '../hooks' // [!code ++]
import './global.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    useMediumZoomProvider(app, router)
  }
  // ...
}
```
