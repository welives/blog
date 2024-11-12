import type { DefaultTheme } from 'vitepress'
export default {
  text: '🐳Docker',
  collapsed: false,
  items: [
    {
      text: '基础',
      link: '/devops/docker/basic',
    },
    {
      text: '常用命令',
      link: '/devops/docker/command',
    },
    {
      text: '搭建远程开发环境',
      link: '/devops/docker/remote-dev',
    },
    {
      text: '安装Nginx服务',
      link: '/devops/docker/nginx',
    },
    {
      text: '安装MySQL服务',
      link: '/devops/docker/mysql',
    },
    {
      text: '安装MongoDB服务',
      link: '/devops/docker/mongodb',
    },
    {
      text: '容器间通信',
      link: '/devops/docker/network',
    },
  ],
} as DefaultTheme.SidebarItem
