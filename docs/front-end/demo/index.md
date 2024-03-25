---
title: 一些Demo
---

## 瀑布流

使用`grid`实现

1. 通过`grid-auto-rows`属性设置`grid`元素的基准行高
2. 设置`grid`元素的`align-items`属性值为`start`，目的是取消其自动拉伸行为
3. 设置`grid`的每一行自动填充，`grid-template-columns: repeat(auto-fill, calc(50% - 5px))`
4. 接着动态获取每个`grid`元素的`clientHeight`，让其除以基准行高并向上取整后加上一个间隔距离值：`const girdHeight = Math.ceil(height / 5) + 2`
5. 最后将计算好的`grid`元素实际高度赋值给`grid-row-end`属性即可

```js
itemList[i].style.gridRowEnd = `span ${girdHeight}`
```

> 我的这个例子是用原生 JS 写的，对于 `Vue`和`React`，可以根据这个思路，将`grid`元素封装成子组件，在子组件挂载阶段获取元素的`clientHeight`并计算出实际的`grid`元素高度即可

<iframe src="/blog/demo/waterfall/grid.html" title="Grid实现瀑布流" height="300" width="100%" scrolling="auto" frameborder="0"></iframe>

## 滚动歌词

因为歌词文件的文本格式通常都是一段歌词正文和时间轴组合而成的，所以大致的实现思路可以分为以下步骤

1. 通过接口获取到歌词文本内容
2. 解析歌词得到一个数组对象，每个对象至少要包含有时间轴信息和歌词正文信息
3. 预先设定好的每句歌词的行高和歌词列表容器的高度
4. 根据解析好的歌词数组对象动态创建一个列表
5. 监听播放器的`timeupdate`事件得到当前歌词的数组下标，然后计算出偏移量

<iframe src="/blog/demo/滚动歌词/index.html" title="滚动歌词" height="300" width="100%" scrolling="auto" frameborder="0"></iframe>

## 购物车动画

<iframe src="/blog/demo/购物车动画/index.html" title="购物车动画" height="500" width="350" scrolling="no" frameborder="0"></iframe>

## 高度自动的过渡效果

<iframe src="/blog/demo/高度自动的过渡/index.html" title="高度自动的过渡效果" height="400" width="100%" scrolling="auto" frameborder="0"></iframe>
