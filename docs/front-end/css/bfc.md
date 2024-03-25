---
title: CSS包含块
head:
  - - meta
    - name: description
      content: CSS包含块
  - - meta
    - name: keywords
      content: 包含块 css bfc
---

说到 CSS 盒模型，这是很多小伙伴耳熟能详的知识，甚至有的小伙伴还能说出`border-box`和`content-box`这两种盒模型的区别

但是一说到 CSS 包含块，有的小伙伴就懵圈了，什么是包含块？好像从来没有听说过这玩意儿

包含块英语全称为`containing block`，实际上平时你在书写 CSS 时，大多数情况下你是感受不到它的存在，因此你不知道这个知识点也是一件很正常的事情。但是这玩意儿是确确实实存在的，[在 CSS 规范中也是明确书写了的](https://drafts.csswg.org/css2/#containing-block-details)

并且，如果你不了解它的运作机制，有时就会出现一些你认为的莫名其妙的现象

那么，这个包含块究竟说了什么内容呢？

::: tip
说起来也简单，**就是元素的尺寸和位置，会受它的包含块所影响。对于一些属性，例如`width`、`height`、`padding`、`margin`，绝对定位元素的偏移值（比如`position`被设置为 `absolute`或`fixed`），当我们对其赋予百分比值时，这些值的计算值，就是通过元素的包含块计算得来**
:::

来看一个简单的例子：

:::code-group

```html
<div class="container">
  <div class="item"></div>
</div>
```

```css
.container {
  width: 500px;
  height: 300px;
  background-color: skyblue;
}
.item {
  width: 50%;
  height: 50%;
  background-color: red;
}
```

:::

<iframe src="/blog/demo/bfc/1.html" title="CSS包含块例子1" height="300" width="100%" scrolling="auto" frameborder="0"></iframe>

请仔细阅读上面的代码，然后你认为`div.item`这个盒子的宽高是多少？

相信你能够很自信的回答这个简单的问题，`div.item`盒子的`width`为`250px`，`height`为`150px`

这个答案确实是没有问题的，但是如果我追问你是怎么得到这个答案的，我猜不了解包含块的你大概率会说，因为它的父元素`div.container`的`width`为`500px`，`50%`就是`250px`，`height`为`300px`，因此`50%`就是`150px`

这个答案实际上是不准确的。正确的答案应该是，`div.item`**的宽高是根据它的包含块来计算的**，而这里包含块的大小，正是这个元素最近的祖先块元素的内容区

因此正如我前面所说，**很多时候你都感受不到包含块的存在**

::: danger 包含块
包含块分为两种，一种是根元素（HTML 元素）所在的包含块，被称之为**初始包含块**（**initial containing block**）。对于浏览器而言，初始包含块的的大小等于视口`viewport`的大小，基点在画布的原点（视口左上角）。它是作为元素绝对定位和固定定位的参照物

另外一种是对于非根元素，对于非根元素的包含块判定就有几种不同的情况了。大致可以分为如下几种：

- 如果元素的`positiion`是`relative`或`static`，那么包含块由离它最近的块容器（block container）的内容区域（content area）的边缘建立
- 如果`position`属性是`fixed`，那么包含块由视口建立
- 如果元素使用了`absolute`定位，则包含块由它的最近的`position`的值不是`static`（也就是值为`fixed`、`absolute`、`relative`或`sticky`）的祖先元素的内边距区的边缘组成

:::

前面两条实际上都还比较好理解，第三条往往是初学者容易比较忽视的，我们来看一个示例：

:::code-group

```html
<div class="container">
  <div class="item">
    <div class="item2"></div>
  </div>
</div>
```

```css
.container {
  width: 500px;
  height: 300px;
  background-color: skyblue;
  position: relative;
}
.item {
  width: 300px;
  height: 150px;
  border: 5px solid;
  margin-left: 100px;
}
.item2 {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 10px;
}
```

:::

<iframe src="/blog/demo/bfc/2.html" title="CSS包含块例子2" height="300" width="100%" scrolling="auto" frameborder="0"></iframe>

根据上面的第三条规则，对于`div.item2`来讲，它的包含块应该是`div.container`，而非`div.item`

如果你能把上面非根元素的包含块判定规则掌握，那么关于包含块的知识你就已经掌握 **80%** 了

::: danger 注意
实际上对于非根元素来讲，包含块还有一种可能，那就是如果`position`属性是`absolute`或`fixed`，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：

- `transform`或`perspective`的值不是`none`
- `will-change`的值是`transform`或`perspective`
- `filter`的值不是`none`或`will-change`的值是`filter`(只在 Firefox 下生效)
- `contain`的值是`paint`(例如: `contain: paint`)

:::

我们再来看一个例子：

:::code-group

```html
<div class="container">
  <div class="item">
    <div class="item2"></div>
  </div>
</div>
```

```css
.container {
  width: 500px;
  height: 300px;
  background-color: skyblue;
  position: relative;
}
.item {
  width: 300px;
  height: 150px;
  border: 5px solid;
  margin-left: 100px;
  transform: rotate(0deg); /* 新增代码 */
}
.item2 {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 10px;
}
```

:::

<iframe src="/blog/demo/bfc/3.html" title="CSS包含块例子3" height="300" width="100%" scrolling="auto" frameborder="0"></iframe>

我们对于上面的代码只新增了一条声明，那就是`transform: rotate(0deg)`，此时的渲染效果却发生了改变，如下图所示：

可以看到，此时对于`div.item2`来讲，包含块就变成了`div.item`

好了，到这里，关于包含块的知识就基本讲完了
