---
title: 瀑布流
---

## 使用`grid`实现

::: details 思路

1. 通过`grid-auto-rows`属性设置`grid`元素的基准行高
2. 设置`grid`元素的`align-items`属性值为`start`，目的是取消其自动拉伸行为
3. 设置`grid`的每一行自动填充，`grid-template-columns: repeat(auto-fill, calc(50% - 5px))`
4. 接着动态获取每个`grid`元素的`clientHeight`，让其除以基准行高并向上取整后加上一个间隔距离值：`const girdHeight = Math.ceil(height / 5) + 2`
5. 最后将计算好的`grid`元素实际高度赋值给`grid-row-end`属性即可

```js
itemList[i].style.gridRowEnd = `span ${girdHeight}`
```

:::

> 我的这个例子是用原生 JS 写的，对于 `Vue`和`React`，可以根据这个思路，将`grid`元素封装成子组件，在子组件挂载阶段获取元素的`clientHeight`并计算出实际的`grid`元素高度即可

<iframe height="300" style="width: 100%;" scrolling="no" title="Grid瀑布流" src="https://codepen.io/welives/embed/eYQqZpO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/eYQqZpO">
  Grid瀑布流</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
