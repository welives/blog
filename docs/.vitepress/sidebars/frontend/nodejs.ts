import type { DefaultTheme } from 'vitepress'
export default {
  text: '☕NodeJS',
  collapsed: false,
  items: [
    {
      text: 'Koa',
      collapsed: true,
      items: [
        {
          text: '搭建工程',
          link: '/front-end/nodejs/koa/create',
        },
        {
          text: '使用Typeorm',
          link: '/front-end/nodejs/koa/typeorm',
        },
        {
          text: '使用Prisma',
          link: '/front-end/nodejs/koa/prisma',
        },
        {
          text: '使用Mongoose',
          link: '/front-end/nodejs/koa/mongoose',
        },
      ],
    },
    {
      text: 'NestJS',
      collapsed: true,
      items: [
        {
          text: '搭建工程',
          link: '/front-end/nodejs/nestjs/create',
        },
        {
          text: '使用Typeorm',
          link: '/front-end/nodejs/nestjs/typeorm',
        },
        {
          text: '使用Prisma',
          link: '/front-end/nodejs/nestjs/prisma',
        },
        {
          text: '使用Mongoose',
          link: '/front-end/nodejs/nestjs/mongoose',
        },
      ],
    },
  ],
} as DefaultTheme.SidebarItem
