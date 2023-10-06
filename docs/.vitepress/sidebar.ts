import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/front-end/': [
    {
      text: 'Web前端',
      collapsed: false,
      items: [
        {
          text: 'CSS',
          link: '/front-end/css/',
          collapsed: true,
          items: [
            {
              text: 'CSS属性计算过程',
              link: '/front-end/css/CSS属性计算过程'
            },
            {
              text: 'CSS包含块',
              link: '/front-end/css/CSS包含块'
            },
            {
              text: '线性渐变',
              link: '/front-end/css/线性渐变'
            },
            {
              text: '瀑布流',
              link: '/front-end/css/瀑布流'
            },
            {
              text: '奇技淫巧',
              link: '/front-end/css/奇技淫巧'
            }
          ]
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
