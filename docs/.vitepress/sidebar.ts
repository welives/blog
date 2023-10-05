import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/front-end/': [
    {
      text: 'Web前端',
      collapsed: false,
      items: [
        {
          text: 'CSS'
        },
        {
          text: 'JavaScript'
        },
        {
          text: 'TypeScript'
        },
        {
          text: 'Vue'
        },
        {
          text: 'React'
        },
        {
          text: '浏览器',
          link: '/front-end/browser/',
          collapsed: true,
          items: [
            {
              text: '浏览器渲染原理',
              link: '/front-end/browser/浏览器渲染原理'
            },
            {
              text: '事件循环',
              link: '/front-end/browser/事件循环'
            },
            {
              text: '跨域',
              link: '/front-end/browser/跨域'
            }
          ]
        }
      ]
    }
  ]
}

export default sidebar
