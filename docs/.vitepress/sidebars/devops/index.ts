import type { DefaultTheme } from 'vitepress'
import device from './device'
import docker from './docker'
import nginx from './nginx'

export default {
  '/devops/': [
    {
      text: '🍍ip地址计算',
      link: '/devops/ip',
    },
    device,
    docker,
    nginx,
  ],
} as DefaultTheme.Sidebar
