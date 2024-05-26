import type { DefaultTheme } from 'vitepress'
export default {
  text: '🥧Monorepo',
  collapsed: true,
  items: [
    {
      text: '代码演示插件实战',
      link: '/front-end/monorepo/code-preview-plugin',
    },
    process.env.NODE_ENV === 'development' && {
      text: '胶囊英语笔记项目',
      collapsed: true,
      items: [
        {
          text: '搭建工程',
          link: '/front-end/monorepo/capsule-english/part-one',
        },
      ],
    },
  ],
} as DefaultTheme.SidebarItem
