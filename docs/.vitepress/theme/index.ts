import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { useMediumZoomProvider } from '../hooks'
import './global.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    useMediumZoomProvider(app, router)
  }
}
