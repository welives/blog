import type { DefaultTheme } from 'vitepress'
export default {
  text: '工程化',
  collapsed: false,
  items: [
    {
      text: 'UmiJS',
      link: '/front-end/engineering/umijs',
    },
    {
      text: 'Next.js',
      link: '/front-end/engineering/nextjs',
    },
    {
      text: 'Expo',
      link: '/front-end/engineering/expo',
    },
    {
      text: 'Vue-Cli',
      link: '/front-end/engineering/vue-cli',
    },
    {
      text: 'Vite',
      collapsed: true,
      items: [
        {
          text: 'Vue工程搭建',
          link: '/front-end/engineering/vite/create-vue',
        },
      ],
    },
    {
      text: 'Nuxt',
      link: '/front-end/engineering/nuxt',
    },
    {
      text: 'uni-app',
      link: '/front-end/engineering/uni-app',
    },
    {
      text: 'Taro',
      collapsed: true,
      items: [
        { text: 'React', link: '/front-end/engineering/taro/create-react' },
        { text: 'Vue', link: '/front-end/engineering/taro/create-vue' },
      ],
    },
    // {
    //   text: 'Electron',
    //   link: '/front-end/engineering/electron',
    // },
  ],
} as DefaultTheme.SidebarItem
