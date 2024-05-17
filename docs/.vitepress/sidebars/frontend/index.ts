import type { DefaultTheme } from 'vitepress'
import automation from './automation'
import engineering from './engineering'
import flutter from './flutter'
import micro from './micro'
import monorepo from './monorepo'
import nodejs from './nodejs'
import web from './web'
import project from './project'


export default {
  '/front-end/': [web, flutter, nodejs, engineering, micro, monorepo, automation, process.env.NODE_ENV === 'development' && project],
} as DefaultTheme.Sidebar
