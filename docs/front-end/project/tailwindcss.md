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

## 暗黑模式在Vue中的写法

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

## 渐变写法

### 线性渐变

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

#### 示例

表示从上到下的线性渐变，起始颜色为`cyan-500`，中间颜色为`pink-500`，结束颜色为`blue-500`

```
bg-gradient-to-b from-cyan-500 via-pink-500 to-blue-500
```

### 径向渐变

Tailwind 没有单独提供径向渐变的封装，但是可以通过传入任意值的方式来实现，缺点是不好维护

例如

```
bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,rgba(0,0,0,0.40)_0%,rgba(255,255,255,0.00)_100%)]
```

其对应的传统写法为

```
background-image: radial-gradient(169.40% 89.55% at 94.76% 6.29%, rgba(0,0,0,0.40) 0%, rgba(255,255,255,0.00) 100%);
```

对于复杂的 CSS 写法，还是建议使用传统写法

## 背景

### [background-clip](https://tailwind.nodejs.cn/docs/background-clip)

默认只提供如下四个固定值用法

| 类                | 原值                            |
| ----------------- | ------------------------------- |
| `bg-clip-border`  | `background-clip: border-box;`  |
| `bg-clip-padding` | `background-clip: padding-box;` |
| `bg-clip-content` | `background-clip: content-box;` |
| `bg-clip-text`    | `background-clip: text;`        |

不支持传入任意值，如果想使用多个值的写法只能用传统写法

```
background-clip: content-box, border-box;
```

### [background-size](https://tailwind.nodejs.cn/docs/background-size)

默认只提供如下三个固定值用法

| 类           | 原值                        |
| ------------ | --------------------------- |
| `bg-auto`    | `background-size: auto;`    |
| `bg-cover`   | `background-size: cover;`   |
| `bg-contain` | `background-size: contain;` |

固定值不满足需求的话，可以用任意值写法

`bg-[length:200px_100px]`、`bg-[length:300%_300%]`

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

## 伪元素和伪类

具体[参考文档](https://tailwind.nodejs.cn/docs/hover-focus-and-other-states)

### 匹配子元素

```
[&>*]:mx-auto
```

### group-hover

即父元素`hover`时，子元素样式变化。例如下面这段代码，当`hover`父元素时，内部子元素会整体向左位移

```vue{9,12,21}
<template>
  <a
    href="#"
    rel="noreferrer noopener"
    target="_blank"
    class="group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-full px-6"
  >
    <div
      class="relative inline-flex items-center transition duration-300 group-hover:-translate-x-6"
    >
      <div
        class="absolute flex items-center justify-center text-violet-400 transition duration-300 group-hover:opacity-0"
      >
        <Iconify name="icon-[carbon--star-filled]"></Iconify>
      </div>
      <span
        class="bg-gradient-to-r from-violet-400 to-pink-200 bg-clip-text pl-6 font-medium text-transparent"
        >Star us on Github</span
      >
      <div
        class="absolute right-0 flex translate-x-12 items-center justify-center text-violet-400 opacity-0 transition duration-300 group-hover:translate-x-6 group-hover:opacity-100"
      >
        <span>👍</span>
      </div>
    </div>
  </a>
</template>
```

### group-active

类似`group-hover`

```vue{8-9}
<template>
  <button class="group btn relative hover:scale-110" :class="$style.star_btn">
    <strong class="z-20 text-[15px] tracking-[5px] text-white">开启Capsule</strong>
    <div :id="$style.container_stars" class="group-hover:!z-10">
      <div :id="$style.stars"></div>
    </div>
    <div class="absolute flex w-[12rem]">
      <div :class="$style.circle" class="group-active:bg-[#fe53bb]"></div>
      <div :class="$style.circle" class="group-active:bg-[#fe53bb]"></div>
    </div>
  </button>
</template>
```
