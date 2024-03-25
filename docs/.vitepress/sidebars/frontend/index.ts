import type { DefaultTheme } from 'vitepress'
import automation from './automation'
import engineering from './engineering'
import flutter from './flutter'
import micro from './micro'
import monorepo from './monorepo'
import nodejs from './nodejs'
import web from './web'

export default {
  '/front-end/': [web, flutter, nodejs, engineering, micro, monorepo, automation],
} as DefaultTheme.Sidebar
