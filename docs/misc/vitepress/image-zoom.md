---
title: 给VitePress增加图片缩放功能
head:
  - - meta
    - name: description
      content: 给VitePress增加图片缩放功能
  - - meta
    - name: keywords
      content: vitepress medium-zoom image 图片 缩放 plugin 插件
---

默认的 Vitepress 加载图片后，因为布局的原因，图片显得很小，很多图片里的内容看不清晰，所以想要一个可以点击图片放大的效果

去谷歌搜索了一番，找到一个方案[issues#854](https://github.com/vuejs/vitepress/issues/854)

## 安装medium-zoom

```sh
pnpm add -D medium-zoom
```

## 引入库以及配置相关文件

### 方式一

新建`docs/.vitepress/theme/index.ts`，添加如下代码

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

这时候，点击图片放大的功能已经实现了，但是效果不尽如人意，会被其他层级的元素遮挡图片(_例如左侧的导航栏_)，所以需要修改一下样式

新建`docs/.vitepress/theme/global.css`，添加如下样式代码，然后在上面的提到的`theme/index.ts`中引入它

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

新建`docs/.vitepress/hooks/useMediumZoom.ts`，添加如下代码

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

::: warning ⚡ 注意
如果是 TS 项目必须要有`docs/.vitepress/.env.d.ts`文件，否则报错说`import.mata`对象上没有`env`属性

```ts
/// <reference types="vite/client" />
```

:::

接着编辑**方式一**中提到的`theme/index.ts`文件

```ts
import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress' // [!code ++]
import { useMediumZoomProvider } from '../hooks' // [!code ++]
import './global.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    const { app, router, siteData } = ctx
    useMediumZoomProvider(app, router) // [!code ++]
  },
  // ...
}
```

## 自定义MarkDown图片渲染插件

新建`docs/.vitepress/plugins/markdown/image.ts`，添加如下代码

```ts
import type MarkdownIt from 'markdown-it'
export function ImagePlugin(md: MarkdownIt) {
  const imageRender = md.renderer.rules.image! // 尾部的这个感叹号的意思是断言此变量肯定有值
  md.renderer.rules.image = (...args) => {
    const [tokens, idx] = args
    if (tokens[idx + 2] && /^<!--.*-->/.test(tokens[idx + 2].content)) {
      const data = tokens[idx + 2].content
      if (/size=/.test(data)) {
        const size = data.match(/size=(\d+)(x\d+)?/)
        tokens[idx].attrs?.push(
          ['width', size?.[1] || ''],
          ['height', size?.[2]?.substring(1) || size?.[1] || '']
        )
      }

      tokens[idx].attrs?.push(['loading', 'lazy'], ['decoding', 'async'])
      tokens[idx + 2].content = ''
      return imageRender(...args)
    }
    tokens[idx].attrs?.push(['loading', 'lazy'], ['decoding', 'async'])
    return imageRender(...args)
  }
}
```

编辑`docs/.vitepress/config.ts`

```ts
import { ImagePlugin } from './plugins/markdown/image' // [!code ++]
export default defineConfig({
  // ...
  markdown: {
    config: (md) => {
      md.use(ImagePlugin) // [!code ++]
    },
  },
})
```

::: tip 🎉
现在`markdown`中的所有图片都能实现点击放大效果了，并且使用了原生自带的懒加载
:::
