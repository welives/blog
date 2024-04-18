import type { DefaultTheme } from 'vitepress'
import frontEnd from './sidebars/frontend'
import misc from './sidebars/misc'
import language from './sidebars/language'
import devops from './sidebars/devops'

const sidebar: DefaultTheme.Sidebar = {
  ...frontEnd,
  ...misc,
  ...devops,
  ...language,
}

export default sidebar
