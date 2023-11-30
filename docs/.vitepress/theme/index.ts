import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'
import { useMediumZoomProvider } from '../hooks'
import './global.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app, router } = ctx
    useMediumZoomProvider(app, router)
    useComponents(app, DemoPreview)
  },
} satisfies Theme
