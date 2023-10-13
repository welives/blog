import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = {
  '/front-end/': [
    {
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
              link: '/front-end/css/CSS属性计算过程'
            },
            {
              text: 'CSS包含块',
              link: '/front-end/css/CSS包含块'
            },
            {
              text: 'BEM命名法',
              link: '/front-end/css/BEM命名法'
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
          text: 'JavaScript',
          collapsed: true,
          items: [
            {
              text: 'this指向',
              link: '/front-end/javascript/this指向'
            },
            {
              text: '原型链',
              link: '/front-end/javascript/原型链'
            },
            {
              text: '继承',
              link: '/front-end/javascript/继承'
            },
            {
              text: '模块导入导出',
              link: '/front-end/javascript/模块导入导出'
            },
            {
              text: '图片懒加载',
              link: '/front-end/javascript/图片懒加载'
            },
            {
              text: '奇技淫巧',
              link: '/front-end/javascript/奇技淫巧'
            }
          ]
        },
        {
          text: 'TypeScript',
          collapsed: true,
          items: [
            {
              text: '类型系统',
              link: '/front-end/typescript/类型系统'
            }
          ]
        },
        {
          text: '浏览器',
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
        },
        {
          text: 'Vue',
          collapsed: true,
          items: [
            {
              text: 'Vue2 生命周期',
              link: '/front-end/vue/Vue2生命周期'
            },
            {
              text: 'new Vue 发生了什么',
              link: '/front-end/vue/newVue'
            },
            {
              text: '虚拟 DOM',
              link: '/front-end/vue/虚拟DOM'
            },
            {
              text: 'Diff 算法',
              link: '/front-end/vue/Diff算法'
            },
            {
              text: 'Vue2 响应式原理',
              link: '/front-end/vue/Vue2响应式原理'
            },
            {
              text: 'nextTick',
              link: '/front-end/vue/nextTick'
            },
            {
              text: '计算属性和监听',
              link: '/front-end/vue/计算属性和监听'
            },
            {
              text: '$set和$delete',
              link: '/front-end/vue/$set和$delete'
            },
            {
              text: 'props',
              link: '/front-end/vue/props'
            },
            {
              text: 'Vue 常见优化手段',
              link: '/front-end/vue/Vue常见优化手段'
            },
            {
              text: '其他',
              link: '/front-end/vue/其他'
            }
          ]
        },
        {
          text: 'React',
          collapsed: true,
          items: [
            {
              text: '基础',
              link: '/front-end/react/基础'
            }
          ]
        }
      ]
    },
    {
      text: 'Flutter',
      collapsed: false,
      items: [
        {
          text: 'Dart基础',
          collapsed: true,
          items: [
            {
              text: '变量',
              link: '/front-end/dart/变量'
            },
            {
              text: '常量',
              link: '/front-end/dart/常量'
            },
            {
              text: '数值',
              link: '/front-end/dart/数值'
            },
            {
              text: '布尔',
              link: '/front-end/dart/布尔'
            },
            {
              text: '字符串',
              link: '/front-end/dart/字符串'
            },
            {
              text: '日期时间',
              link: '/front-end/dart/日期时间'
            },
            {
              text: '列表',
              link: '/front-end/dart/列表'
            },
            {
              text: 'Map',
              link: '/front-end/dart/Map'
            },
            {
              text: 'Set',
              link: '/front-end/dart/Set'
            },
            {
              text: '函数',
              link: '/front-end/dart/函数'
            },
            {
              text: '操作符',
              link: '/front-end/dart/操作符'
            },
            {
              text: '流程控制',
              link: '/front-end/dart/流程控制'
            },
            {
              text: '异常',
              link: '/front-end/dart/异常'
            },
            {
              text: '类',
              link: '/front-end/dart/类'
            },
            {
              text: 'getter 和 setter',
              link: '/front-end/dart/getter和setter'
            },
            {
              text: 'static',
              link: '/front-end/dart/static'
            },
            {
              text: 'abstract',
              link: '/front-end/dart/abstract'
            },
            {
              text: 'interface',
              link: '/front-end/dart/interface'
            },
            {
              text: 'extends',
              link: '/front-end/dart/extends'
            },
            {
              text: 'mixin',
              link: '/front-end/dart/mixin'
            },
            {
              text: 'factory',
              link: '/front-end/dart/factory'
            },
            {
              text: '泛型',
              link: '/front-end/dart/泛型'
            },
            {
              text: '生成器',
              link: '/front-end/dart/生成器'
            },
            {
              text: '空安全',
              link: '/front-end/dart/空安全'
            }
          ]
        }
      ]
    },
    {
      text: 'NodeJS',
      collapsed: false,
      items: [
        {
          text: 'Koa',
          collapsed: true,
          items: [
            {
              text: '搭建项目',
              link: '/front-end/nodejs/koa/搭建项目'
            },
            {
              text: '使用Prisma',
              link: '/front-end/nodejs/koa/使用prisma'
            },
            {
              text: '使用Typeorm',
              link: '/front-end/nodejs/koa/使用typeorm'
            },
            {
              text: '使用Mongoose',
              link: '/front-end/nodejs/koa/使用mongoose'
            }
          ]
        }
      ]
    }
  ],
  '/misc/': [
    {
      text: '部署博客',
      link: '/misc/部署博客'
    },
    {
      text: 'VitePress优化',
      collapsed: false,
      items: [
        {
          text: '图片缩放功能',
          link: '/misc/vitepress/图片缩放功能'
        }
      ]
    },
    {
      text: '杂项',
      collapsed: false,
      items: [
        {
          text: 'VSCode',
          link: '/misc/vscode'
        },
        {
          text: 'win10开发环境搭建',
          link: '/misc/win10开发环境搭建'
        },
        {
          text: 'git常用命令',
          link: '/misc/git'
        }
      ]
    },
    {
      text: 'Docker',
      collapsed: false,
      items: [
        {
          text: '基础',
          link: '/misc/docker/基础'
        },
        {
          text: '搭建远程开发环境',
          link: '/misc/docker/搭建远程开发环境'
        }
      ]
    }
  ]
}

export default sidebar
