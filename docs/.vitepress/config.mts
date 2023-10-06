import { defineConfig } from 'vitepress'
import sidebar from './sidebar'
// import renderInlineCode from './render-inline-code'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "welives's blog",
  description: '一个使用vitepress构建的编写学习笔记的个人博客',
  srcDir: './src',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]
  ],
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: '前端', link: '/front-end/' },
      { text: '杂项', link: '/misc/' }
    ],
    sidebar,
    outline: 'deep',
    socialLinks: [{ icon: 'github', link: 'https://github.com/welives/notebook' }],
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2023-present welives'
    }
  }
  // markdown: {
  //   config: (md) => {
  //     md.use(renderInlineCode)
  //   }
  // }
})
