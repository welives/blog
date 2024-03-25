import type { DefaultTheme } from 'vitepress'
export default {
  text: 'Docker',
  collapsed: false,
  items: [
    {
      text: '基础',
      link: '/misc/docker/basic',
    },
    {
      text: '搭建远程开发环境',
      link: '/misc/docker/remote-dev',
    },
    {
      text: '安装MySQL服务',
      link: '/misc/docker/mysql',
    },
    {
      text: '安装MongoDB服务',
      link: '/misc/docker/mongodb',
    },
  ],
} as DefaultTheme.SidebarItem
