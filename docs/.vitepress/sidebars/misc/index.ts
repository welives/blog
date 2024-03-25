import type { DefaultTheme } from 'vitepress'
import deployBlog from './deploy'
import docker from './docker'
import github from './github'
import other from './other'
import vitepress from './vitepress'

export default {
  '/misc/': [deployBlog, github, vitepress, docker, other],
} as DefaultTheme.Sidebar
