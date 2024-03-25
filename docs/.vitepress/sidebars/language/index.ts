import type { DefaultTheme } from 'vitepress'
import english from './english'
import japanese from './japanese'

export default {
  '/language/': [english, japanese],
} as DefaultTheme.Sidebar
