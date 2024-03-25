import type { DefaultTheme } from 'vitepress'
export default {
  text: 'Web前端',
  link: '/front-end/',
  collapsed: false,
  items: [
    {
      text: 'CSS',
      collapsed: true,
      items: [
        {
          text: 'CSS属性计算过程',
          link: '/front-end/css/css-computed',
        },
        {
          text: 'CSS包含块',
          link: '/front-end/css/bfc',
        },
        {
          text: 'BEM命名法',
          link: '/front-end/css/bem-naming',
        },
        {
          text: '线性渐变',
          link: '/front-end/css/linear-gradient',
        },
        {
          text: '奇技淫巧',
          link: '/front-end/css/technique',
        },
      ],
    },
    {
      text: 'JavaScript',
      collapsed: true,
      items: [
        {
          text: 'this指向',
          link: '/front-end/javascript/this',
        },
        {
          text: '原型链',
          link: '/front-end/javascript/prototype',
        },
        {
          text: '继承',
          link: '/front-end/javascript/extends',
        },
        {
          text: '模块导入导出',
          link: '/front-end/javascript/module',
        },
        {
          text: '图片懒加载',
          link: '/front-end/javascript/lazy-load',
        },
        {
          text: '奇技淫巧',
          link: '/front-end/javascript/technique',
        },
      ],
    },
    {
      text: 'TypeScript',
      collapsed: true,
      items: [
        {
          text: '类型系统',
          link: '/front-end/typescript/type-system',
        },
      ],
    },
    {
      text: '浏览器',
      collapsed: true,
      items: [
        {
          text: '浏览器渲染原理',
          link: '/front-end/browser/rendering',
        },
        {
          text: '事件循环',
          link: '/front-end/browser/eventloop',
        },
        {
          text: '跨域',
          link: '/front-end/browser/cross-domain',
        },
      ],
    },
    {
      text: 'Vue',
      collapsed: true,
      items: [
        {
          text: 'Vue2 生命周期',
          link: '/front-end/vue/vue2-lifecycle',
        },
        {
          text: 'new Vue 发生了什么',
          link: '/front-end/vue/newVue',
        },
        {
          text: '虚拟 DOM',
          link: '/front-end/vue/virtual-dom',
        },
        {
          text: 'Diff 算法',
          link: '/front-end/vue/diff',
        },
        {
          text: 'Vue2 响应式原理',
          link: '/front-end/vue/vue2-reactivity',
        },
        {
          text: 'nextTick',
          link: '/front-end/vue/nextTick',
        },
        {
          text: '计算属性和监听',
          link: '/front-end/vue/computed-and-watch',
        },
        {
          text: '$set和$delete',
          link: '/front-end/vue/$set-and-$delete',
        },
        {
          text: 'props',
          link: '/front-end/vue/props',
        },
        {
          text: 'Vue2 常见优化手段',
          link: '/front-end/vue/vue2-optimization',
        },
        {
          text: '其他',
          link: '/front-end/vue/other',
        },
      ],
    },
    {
      text: 'React',
      collapsed: true,
      items: [
        {
          text: '基础',
          link: '/front-end/react/basic',
        },
      ],
    },
    {
      text: '常用工具封装',
      link: '/front-end/encapsulation',
    },
    {
      text: '一些Demo',
      link: '/front-end/demo/',
      collapsed: true,
      items: [
        {
          text: '课程表',
          link: '/front-end/demo/draggable',
        },
      ],
    },
    // {
    //   text: '制作NPM包',
    //   link: '/front-end/npm/create-package',
    // },
  ],
} as DefaultTheme.SidebarItem
