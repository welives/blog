import type { DefaultTheme } from 'vitepress'
import device from './device'
import docker from './docker'

export default {
  '/devops/': [
    {
      text: '🍍ip地址计算',
      link: '/devops/ip',
    },
    device,
    docker,
  ],
} as DefaultTheme.Sidebar
