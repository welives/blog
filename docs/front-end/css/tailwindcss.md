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

例如

```
ring ring-slate-100
```
