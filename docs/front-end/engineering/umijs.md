---
title: 使用UmiJS搭建工程
---

::: tip 目标
搭建一个 UmiJS + TailwindCSS + TypeScript + ESLint + Prettier 的工程

[本工程的Github地址](https://github.com/welives/umi-starter)
:::

相关文档

- [UmiJS](https://umijs.org/)
- [TypeScript](https://www.tslang.cn/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制

## 初始化项目

```sh
mkdir umi-starter && cd umi-starter
pnpm dlx create-umi@latest
```

![](./assets/umi/create-umi.png)

初始化完毕后再安装一个`cross-env`用来兼容在不同的操作系统中使用环境变量

```sh
pnpm add -D cross-env
```

这样就创建好一个以`UmiJS`为脚手架的基础工程了，接下来我们对这个它做亿点点额外的配置

## 添加EsLint

详细的文档[看这里](https://umijs.org/docs/guides/lint)

::: code-group

```sh
pnpm add -D @umijs/lint eslint stylelint
touch .eslintrc.js
touch .eslintignore
touch .stylelintrc.js
```

```js [.eslintrc.js]
module.exports = {
  extends: require.resolve('umi/eslint'),
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

```ini [.eslintignore]
.DS_Store
node_modules
dist
.idea
.vscode
.umi
```

```js [.stylelintrc.js]
module.exports = {
  extends: require.resolve('umi/stylelint'),
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply'],
      },
    ],
  },
}
```

```json [package.json]
{
  "scripts": {
    // ...
    "lint": "umi lint" // [!code ++]
  }
}
```

:::

## 添加Prettier

详细的文档[看这里](https://umijs.org/docs/guides/generator#prettier-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8)

```sh
pnpm umi g prettier
```

## 添加TailwindCSS

```sh
pnpm umi g tailwindcss
```

## 启用数据流插件

为了拥有良好的开发体验，以`hooks`范式使用和管理全局状态，我们需要启用`@umijs/plugin-model`插件

::: tip
关于 Umi 插件的详细文档[看这里](https://umijs.org/docs/guides/use-plugins)，Umi 的官方插件列表[看这里](https://github.com/umijs/plugins)
:::

由于普通的 Umi 应用中，默认不附带任何插件，所以我们需要先安装它

```sh
pnpm add -D @umijs/plugins
```

修改`.umirc.ts`或者`config/config.ts`文件

```ts
export default defineConfig({
  // ...
  plugins: ['@umijs/plugins/dist/tailwindcss', '@umijs/plugins/dist/model'], // [!code hl]
  model: {}, // [!code ++]
})
```

### 计数器例子

数据流插件要求在`src`目录下创建一个`models`目录，该目录下存放需要全局共享的数据

::: code-group

```sh
mkdir src/models
touch src/models/count.ts
```

```ts [count.ts]
import { useCallback, useState } from 'react'

export default () => {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => setCounter((c) => c + 1), [])
  const decrement = useCallback(() => setCounter((c) => c - 1), [])

  return { counter, increment, decrement }
}
```

:::

然后修改这个基础项目中的`src/pages/index.tsx`和`src/pages/docs.tsx`文件

::: code-group

```tsx [index.tsx]
import { useModel } from 'umi'

export default function HomePage() {
  const { counter, increment, decrement } = useModel('count')
  return (
    <div>
      <button onClick={decrement}>minus</button>
      <span className="mx-3">{counter}</span>
      <button onClick={increment}>plus</button>
    </div>
  )
}
```

```tsx [docs.tsx]
import { useModel } from 'umi'

export default function DocsPage() {
  const { counter, increment, decrement } = useModel('count')
  return (
    <div>
      <button onClick={decrement}>minus</button>
      <span className="mx-3">{counter}</span>
      <button onClick={increment}>plus</button>
    </div>
  )
}
```

:::

启动项目查看这个计数器例子，可以看到在`HomePage`页面中修改了`counter`的值后，`DocsPage`页面中也会跟着改变
