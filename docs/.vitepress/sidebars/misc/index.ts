import type { DefaultTheme } from 'vitepress'
import deployBlog from './deploy'
import github from './github'
import other from './other'
import vitepress from './vitepress'

export default {
  '/misc/': [deployBlog, github, vitepress, other],
} as DefaultTheme.Sidebar
