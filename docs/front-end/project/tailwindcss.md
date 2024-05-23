## 文档

[中文文档](https://www.tailwindcss.cn/)

## 尺寸

默认情况下，`TailwindCSS`的`1rem`等于`16px`，而浏览器的默认字体大小也正好是`16px`

## 重置浏览器默认样式

编辑`tailwind.config.js`

```js
module.exports = {
  corePlugins: {
    preflight: true, // [!code ++]
  },
}
```

## 解决自定义样式无智能感知

- **方式一(推荐)**

实现方式参考自 VSCode 插件 [Tailwind CSS IntelliSense 的 issue#227](https://github.com/tailwindlabs/tailwindcss-intellisense/issues/227)

假设你的自定义样式写在`assets/css/style.css`文件中，那么新建`tailwind.plugin.cjs`，用来编写样式文件的读取逻辑，接着在`tailwind.config.js`中引入

这种方式的好处是：在`css`文件中定义样式的时候可以获得代码智能感知

::: code-group

```css [style.css]
@layer utilities {
  .header-link {
    @apply mx-1 px-3 py-2 font-medium transition-all duration-150 hover:cursor-pointer hover:text-violet-950;
  }
}
```

```js [tailwind.plugin.cjs]
const postcss = require('postcss')
const postcssJs = require('postcss-js')
const { readFileSync } = require('fs')

require.extensions['.css'] = function (module, filename) {
  module.exports = ({ addBase, addComponents, addUtilities }) => {
    const css = readFileSync(filename, 'utf8')
    const root = postcss.parse(css)
    const jss = postcssJs.objectify(root)

    if ('@layer base' in jss) {
      addBase(jss['@layer base'])
    }
    if ('@layer components' in jss) {
      addComponents(jss['@layer components'])
    }
    if ('@layer utilities' in jss) {
      addUtilities(jss['@layer utilities'])
    }
  }
}
```

```js [tailwind.config.js]
require('./tailwind.plugin.cjs') // [!code ++]

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    // ...
    require('./assets/css/style.css'), // [!code ++]
  ],
}
```

:::

- **方式二**

新建`tailwind.plugin.cjs`用来维护自定义样式，然后`tailwind.config.js`中引入

这种方式其实就是把内置的`tailwindcss/plugin`单独提出来，写在一个独立的文件中进行管理而已。但是这种在 JS 文件中定义样式的方式，在定义的时候是无法获得代码智能感知的，只有在调用的时候才会智能感知

::: code-group

```js [tailwind.plugin.cjs]
const plugin = require('tailwindcss/plugin')

module.exports = plugin(({ addBase, addComponents, addUtilities }) => {
  addBase({})
  addComponents({})
  addUtilities({
    '.header-link': {
      '@apply px-3 mx-1 py-2 transition-all duration-150 hover:text-violet-950 font-medium hover:cursor-pointer': true,
    },
  })
})
```

```js [tailwind.config.js]
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    // ...
    require('./tailwind.plugin.cjs'), // [!code ++]
  ],
}
```

:::

## 五个预设响应式断点

| 前缀  | 最小宽度 | CSS                                  |
| ----- | -------- | ------------------------------------ |
| `sm`  | `640px`  | `@media (min-width: 640px) { ... }`  |
| `md`  | `768px`  | `@media (min-width: 768px) { ... }`  |
| `lg`  | `1024px` | `@media (min-width: 1024px) { ... }` |
| `xl`  | `1280px` | `@media (min-width: 1280px) { ... }` |
| `2xl` | `1536px` | `@media (min-width: 1536px) { ... }` |

TailwindCSS 采用移动端优先策略，即不加前缀的工具类都是针对小屏幕的，加了前缀的工具类都是针对大屏幕的。比如，`text-center`是针对小屏幕的，`lg:text-center`是针对大屏幕(PC端)的

在前端开发中，一个默认的共识是：屏幕尺寸小于`480px`的是手机端，`480px ~ 1024px`的是平板端，`1024px ~ 1280px`的是大 pad 尺寸和小笔记本屏幕的混合区。大于 `1280px` 的是 PC 端

由于 TailwindCSS 的第一个断点屏幕尺寸是`640px`，但其实最大的手机屏幕宽度也不过`480px`，所以，如果你有一些针对手机端的特殊布局，可以考虑编辑`tailwind.config.js`添加一个断点

```js
import defaultTheme from 'tailwindcss/defaultTheme' // [!code ++]
const config = {
  // ...
  theme: {
    screens: {
      xs: '480px', // [!code ++]
      ...defaultTheme.screens,
    },
  },
  //...
}
```

## 线性渐变写法

```
bg-gradient-to-目标点 [from-颜色] [via-颜色] [to-颜色]
```

下表是 TailwindCSS 支持的八个方向线性渐变

| 样式                | 描述             |
| ------------------- | ---------------- |
| `bg-gradient-to-t`  | 从下到上         |
| `bg-gradient-to-tr` | 从左下角到右上角 |
| `bg-gradient-to-r`  | 从左到右         |
| `bg-gradient-to-br` | 从左上角到右下角 |
| `bg-gradient-to-b`  | 从上到下         |
| `bg-gradient-to-bl` | 从右上角到左下角 |
| `bg-gradient-to-l`  | 从右到左         |
| `bg-gradient-to-tl` | 从右下角到左上角 |

### 示例

表示从上到下的线性渐变，起始颜色为`cyan-500`，中间颜色为`pink-500`，结束颜色为`blue-500`

```
bg-gradient-to-b from-cyan-500 via-pink-500 to-blue-500
```

## 匹配子元素

```
[&>*]:mx-auto
```

## 子元素间距

- **space-x-\***：水平间距，例如`space-x-2`
- **space-y-\***：垂直间距，例如`space-y-2`

TailwindCSS 中的`space-*`是利用`margin`属性在父元素中为子元素设置水平方向的外边距`margin-left`与`margin-right`或垂直方向的外边距`margin-top`与`margin-bottom`

解析后得到的CSS代码如下

```
.space-* > :not([hidden]) ~ :not([hidden]) {}
```

## 环绕边框

TailwindCSS 中的`ring-*`是利用`box-shadow`创建带有环绕轮廓效果的边框，并不是`outline`或`border`

常见的使用场景是给元素描边

例如

```
ring ring-slate-100
```

## 夜间模式在Vue中的写法

在`scoped`中使用`@apply`指令可以正确解析`dark:`这个主题断点

当然，也可以使用传统的css权重写法来匹配主题类

::: code-group

```vue [使用@apply解析断点]
<template>
  <div class="test">
    <slot />
  </div>
</template>

<style scoped>
.test {
  @apply border border-[#ddd] text-gray-800 dark:border-[#333] dark:text-gray-100;
}
</style>
```

```vue [传统css权重写法]
<template>
  <div class="test">
    <slot />
  </div>
</template>

<style scoped>
.test {
  @apply border border-[#ddd] text-gray-800;
}
.dark .test {
  @apply border-[#333] text-gray-100;
}
</style>
```

:::

而在`css-module`中，`@apply`指令无法解析类似`dark:`这类主题断点，必须使用`:global`来匹配主题类

```vue
<template>
  <div :class="$style.test">
    <slot />
  </div>
</template>

<style module>
.test {
  @apply border border-[#ddd] text-gray-800;
}
:global(.dark) .test {
  @apply border-[#333] text-gray-100;
}
</style>
```
