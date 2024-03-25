import type { DefaultTheme } from 'vitepress'
export default {
  text: '英语',
  collapsed: false,
  link: '/language/english/',
  items: [
    {
      text: '发音',
      link: '/language/english/pronunciation',
    },
    {
      text: '新概念英语',
      collapsed: true,
      items: [
        {
          text: '第一册',
          link: '/language/english/nce/one',
        },
      ],
    },
  ],
} as DefaultTheme.SidebarItem
