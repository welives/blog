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
          items: [
            {
              text: 'Lesson1~30',
              link: '/language/english/nce/one-part-1'
            },
            {
              text: 'Lesson31~66',
              link: '/language/english/nce/one-part-2'
            },
            {
              text: 'Lesson67~106',
              link: '/language/english/nce/one-part-3'
            },
            {
              text: 'Lesson107~144',
              link: '/language/english/nce/one-part-4'
            }
          ]
        },
        // {
        //   text: '第二册',
        //   link: '/language/english/nce/two',
        // },
      ],
    },
  ],
} as DefaultTheme.SidebarItem
