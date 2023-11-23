import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { useMediumZoomProvider, useComponents } from '../hooks'
import './global.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    const { app, router, siteData } = ctx
    useMediumZoomProvider(app, router)
    useComponents(app)
  },
}
