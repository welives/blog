import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'
import { useMediumZoomProvider, useBackToTop } from '../hooks'
import './global.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    const { app, router } = ctx
    useMediumZoomProvider(app, router)
    useComponents(app, DemoPreview)
    useBackToTop()
  },
} satisfies Theme
