import { defineConfig } from 'vitepress'
import sidebar from './sidebar'
import renderInlineCode from './render-inline-code.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "welives's blog",
  description: '一个使用vitepress构建的编写学习笔记的个人博客',
  srcDir: './src',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '前端', link: '/front-end/' },
      { text: '杂项', link: '/misc' }
    ],

    sidebar,
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/welives/notebook' }],
    footer: {
      message: 'MIT Licensed | Copyright © 2023-present welives'
    }
  },
  markdown: {
    config: (md) => {
      md.use(renderInlineCode)
    }
  }
})
