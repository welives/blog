import type { DefaultTheme } from 'vitepress'
export default {
  text: '🍑VitePress优化',
  collapsed: false,
  items: [
    {
      text: '引入TailwindCSS',
      link: '/misc/vitepress/tailwindcss',
    },
    {
      text: '图片缩放功能',
      link: '/misc/vitepress/image-zoom',
    },
    {
      text: '代码演示功能',
      link: '/misc/vitepress/demo-preview',
    },
  ],
} as DefaultTheme.SidebarItem
