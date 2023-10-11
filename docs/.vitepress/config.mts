import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'welives',
  description: '一个使用vitepress构建的编写学习笔记的个人博客',
  base: '/blog',
  srcDir: './src',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-CWC890FH58' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CWC890FH58');`
    ]
  ],
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: '前端', link: '/front-end/' },
      { text: '杂项', link: '/misc/' },
      { text: '关于', link: '/about' }
    ],
    sidebar,
    outline: 'deep',
    socialLinks: [{ icon: 'github', link: 'https://github.com/welives/blog' }],
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
})
