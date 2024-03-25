import type { DefaultTheme } from 'vitepress'
import frontEnd from './sidebars/frontend'
import misc from './sidebars/misc'
import language from './sidebars/language'

const sidebar: DefaultTheme.Sidebar = {
  ...frontEnd,
  ...misc,
  ...language,
}

export default sidebar
