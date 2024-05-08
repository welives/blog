import type { DefaultTheme } from 'vitepress'
export default {
  text: '🍎英语',
  collapsed: false,
  link: '/language/english/',
  items: [
    {
      text: '发音',
      link: '/language/english/pronunciation',
    },
    {
      text: '基础概念',
      link: '/language/english/basic_concept',
    },
    {
      text: '语法',
      link: '/language/english/grammar',
    },
    {
      text: '新概念英语',
      collapsed: true,
      items: [
        {
          text: '第一册',
          link: '/language/english/nce/one',
        },
        {
          text: '第二册',
          link: '/language/english/nce/two',
        },
      ],
    },
  ],
} as DefaultTheme.SidebarItem
