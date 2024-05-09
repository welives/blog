## 在Vitepress中引入TailwindCSS

```sh
pnpm add -D tailwindcss postcss autoprefixer
```

①项目根目录创建`tailwind.config.js`和`postcss.config.js`文件

::: code-group

```js [tailwind.config.js]
/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./docs/.vitepress/**/*.{js,ts,vue}', './docs/**/*.md'],
}
export default config
```

```js [postcss.config.js]
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

:::

②新建编辑`docs/.vitepress/theme/tailwind.css`，添加如下代码

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 添加自己的样式 */
}
```

③编辑`docs/.vitepress/theme/index.ts`(_如果没有这个文件的话就手动创建_)，添加如下代码

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// ...
import './tailwind.css' // [!code ++]

export default {
  extends: DefaultTheme,
  // ...
} satisfies Theme
```

## 引入iconify图标库

先安装`iconify`的`tailwind`插件

```sh
pnpm add -D @iconify/tailwind
```

接着编辑根目录的`tailwind.config.js`

```js
import { addDynamicIconSelectors } from '@iconify/tailwind' // [!code ++]
/** @type {import('tailwindcss').Config} */
const config = {
  // ...
  plugins: [addDynamicIconSelectors()], // [!code ++]
}
export default config
```

图标字体我目前在Vitepress就安装了下面三种

```sh
pnpm add -D @iconify-json/devicon @iconify-json/logos @iconify-json/skill-icons
```

至于其他的根据自己的需求安装吧，详细的看[官方文档](https://iconify.design/docs/icons/all.html)
