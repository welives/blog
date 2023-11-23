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
  // 如果是TS项目,根目录必须要有tsconfig.json,否则这里会报错说 import.mata对象上没有env属性
  // @ts-expect-error
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
