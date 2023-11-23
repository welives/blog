import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '全栈学习笔记',
  description: '一个使用VitePress构建的编写学习笔记的个人博客',
  base: '/blog',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'keywords', content: 'Vue,React,CSS,JS,javascript,typescript,docker' }],
    ['meta', { name: 'author', content: 'welives' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        if(location.host.includes('gitee')) {
          hm.src = "https://hm.baidu.com/hm.js?8491a10e5858289ff628928c0a9cde90";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        }
        if(location.host.includes('github')) {
          hm.src = "https://hm.baidu.com/hm.js?aa8beab92ad3b999631569311b1f9bb2";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        }
      })();`,
    ],
    [
      'script',
      { async: '' },
      `(function() {
        var google = document.createElement("script");
        if(location.host.includes('gitee')) {
          google.src = "https://www.googletagmanager.com/gtag/js?id=G-1ZQYVKCJWX";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(google, s);
        }
        if(location.host.includes('github')) {
          google.src = "https://www.googletagmanager.com/gtag/js?id=G-CWC890FH58";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(google, s);
        }
      })();`,
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      if(location.host.includes('github')) {
        gtag('config', 'G-CWC890FH58');
      }
      if(location.host.includes('gitee')) {
        gtag('config', 'G-1ZQYVKCJWX');
      }`,
    ],
  ],
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    search: {
      provider: 'local',
    },
    logo: '/logo.svg',
    nav: [
      { text: '前端', link: '/front-end/' },
      { text: '杂项', link: '/misc/' },
      { text: '关于', link: '/about' },
    ],
    sidebar,
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/welives/blog' },
      {
        icon: {
          svg: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="130px" height="130px" viewBox="0 0 130 130" enable-background="new 0 0 130 130" xml:space="preserve"><title>Gitee</title><image id="image0" width="130" height="130" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD///8pKSl6enpWVlZ2dnb6+voGBgZcXFwhISHi4uKnp6cVFRUzMzO7u7uJiYk7OzvOzs7FxcWRkZG1tbXq6ur09PRISEjY2NhBQUEODg5vb2+YmJgaGhpNTU2CgoJnZ2etX0tDAAAE2klEQVR4nM2c6WKqMBCFQ2vDJiAgStXWvv9TXsAFDZOThYTL+V/4SpKZySyywEpNmafFOcribRhu4110LtK8bOyexUz/gCdVfcxiRijOjnWZcL8IvCw21MtfdIqK0ozCBCG/Kl7/xLhWPhBa3fffVbduEXgVmQF0CqNKb0G0EPKjMcCg39wRwn5nB9Brt3eA0H7bA/T6LmciNF/zAHp9KUwWRtif5hN0ZxRvCYTQqMyQtiL0IQDCnrTCdorBtpQi8NodQK+L1EjIEA7mtkih6GCGkISuCTpzmZgglO4BetHOi0TI/RAwRp5OCiH1RcAYdTAIBI8EJMMUwdsq3DTdDxOEyi8BYxO3JSIkvgkYE8+mgHDwYA9EnQ4IgTu3iZQiDhAuSxB0oa0cYb8MgXA0XxEah94ZK24kCHobIfyJP8xEPCSiEXSW4XjJW5nTlYoyNS9LMSI0yjgxSo3fLmU4jUsxIqhi5cjwtvoqYi2+pgiKEGGrcScxQhgN9RMBX5n+LJcAIHyLCHgvprMAaITnjnwgZD4JaITsHQEGCbMJaIRHGHdD4Oj2Pp9AgnDkLwgoTvmbTyBBuEdQNwRgmrfzzgJEiEaEFnyEWfZAgcDaJ0IhJ4jws/Uk/ReLJwL4CMociYYaudl7IIDNGE39Ai/rTyOdt/LnV3cEkFGcHsiL0wD3ekPg4KHiR2ihFTVXyAcE4CM3IoHz0K4dEMB5uAgIjr8BG84ECzhIagkXQMe5n14b3iGAhIqQF+HuCfpXMHQk43fj7OXGW3UI4OvG7+sANo296g4B+OmPdwQHyeCpjgHjYJcvgZBxlvz8X4SfhKE9tgRCB4CixkUQcobyawqE7UZLv9ixpQydNIywkyR0J2qBt+5MNDvbIpx0CRSXxTNDZQ+IIHpRJFnsODyHobvkIgg7hiKARRBihrbKIghbhk7MIgjhGhBWsBAr2I4rOJQrME1LGGiIcJ7hpjJ9BoRQeHHWhZgWQQipn5Dlg+sj5J4Ct4s+QuUpfP3URujCVz9BvD5CF8T7ucroIxzxhc4eodZGqPG11h6h1Eao8OXeHkH7UA6Xe5DisEYQ1iGQu+MhxQHu7LYImUDQyIOSQpHuskSIxT5DsN3KW9JPWpoTEDTLydmk01Huh05ckfoUEBT1q7vEfRCgRP899Sn/TiJCkKqSvTXVZgnSZI8EsDQNPkGwE4gHgkBRDHCDwH+lBGMxQFYvcIMgPw/hWBKR7RcnCAf5Jn4pDMlAnSAAN/haHpMUCV0ggLrX72uRUFIqdYCAmpTeSqUSqzMfoQEBkVAwpsvmsxESVAUWy+YB1e48FwHVP6fNA6S/nIdwwBWUaQsF5YrnIPAcOzWikYRspzEZc3jTIVV08pPtNOSOtGDgTZmqe7jJpiLaTBt2UXWKYbr3Lklr1RoazFbQZuelEEnp/d69upbLRRpPQ9h4uob2W2/t8KOUTcjeW7GnbfFEQ7rXo6nVkO6VQbMt32NTOulyFh3RoDuUVjuosoZxHfdDS7Xx0FKwgtGtTo2zxbAdYOuU60RASm3tx/iCNQwzdir/90hnr/2MtrLMxWBrL9vx3qOr8d5gGHI2Npduh5x7mY56F45HvW/Kr5qfwtPA+6B+7F+B4Xfs/0aRlOjHDyrfP37w1P0nIHYufgLiHzFWQBM4DfBJAAAAAElFTkSuQmCC" /></svg>`,
        },
        link: 'https://gitee.com/welives/blog',
      },
    ],
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2023-present welives',
    },
  },
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config: (md) => {},
  },
  vite: {
    plugins: [vueJsx()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('../', import.meta.url)),
      },
    },
  },
})
