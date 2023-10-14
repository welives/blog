---
title: Vue的虚拟DOM
---

要知道渲染`真实DOM`的开销是很大的，比如有时候我们修改了某个数据，**如果直接渲染到真实 dom 上会引起整个 dom 树的重绘和重排**，有没有可能我们只更新我们修改的那一小块 dom 而不要更新整个 dom 呢？

`diff算法`能够帮助我们

我们先根据真实 DOM 生成一颗`Virtual DOM`，当`Virtual DOM`某个节点的数据改变后会生成一个新的`Vnode`，然后`Vnode`和`oldVnode`作对比，发现有不一样的地方就直接修改在真实的 DOM 上，然后使`oldVnode`的值为`Vnode`

`diff`的过程就是调用名为`patch`的函数，比较新旧节点，一边比较一边给**真实的 DOM**打补丁

## Virtual DOM 和真实 DOM 的区别

`Virtual DOM`是将真实的 DOM 的数据抽取出来，以对象的形式模拟树形结构。比如 dom 是这样的：

```html
<div>
  <p>123</p>
</div>
```

对应的`Virtual DOM`（伪代码）：

```js
var Vnode = {
  tag: 'div',
  children: [{ tag: 'p', text: '123' }]
}
```

::: tip 提示
温馨提示：`VNode`和`oldVNode`都是对象，一定要记住

- 用 JavaScript 对象模拟 DOM
- 把此虚拟 DOM 转成真实 DOM 并插入页面中
- 如果有事件发生修改了虚拟 DOM
- 比较两棵虚拟 DOM 树的差异，得到差异对象
- 把差异对象应用到真正的 DOM 树上

:::

## VNode

对于`VNode`，相信大家一点都不陌生，用于表示虚拟节点，是实现`Virtual DOM`的一种方式。那么它究竟是怎样的呢？我们就去`Vue`源码里探讨一下

```ts
export default class VNode {
  // ...
  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | null,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag // 标签名
    this.data = data // 属性 如id/class
    this.children = children // 子节点
    this.text = text // 文本内容
    this.elm = elm // 该VNode对应的真实节点
    this.ns = undefined // 节点的namespace
    this.context = context // 该VNode对应实例
    this.fnContext = undefined // 函数组件的上下文
    this.fnOptions = undefined // 函数组件的配置
    this.fnScopeId = undefined // 函数组件的ScopeId
    this.key = data && data.key // 节点绑定的key 如v-for
    this.componentOptions = componentOptions // 组件VNode的options
    this.componentInstance = undefined // 组件的实例
    this.parent = undefined // vnode组件的占位符节点
    this.raw = false // 是否为平台标签或文本
    this.isStatic = false // 静态节点
    this.isRootInsert = true // 是否作为根节点插入
    this.isComment = false // 是否是注释节点
    this.isCloned = false // 是否是克隆节点
    this.isOnce = false // 是否是v-noce节点
    this.asyncFactory = asyncFactory // 异步工厂方法
    this.asyncMeta = undefined // 异步meta
    this.isAsyncPlaceholder = false // 是否为异步占位符
  }

  // 别名
  get child(): Component | void {
    return this.componentInstance
  }
}
```

这里千万不要因为`VNode`的这么多属性而被吓到，或者咬紧牙去摸清楚每个属性的意义，其实，我们主要了解其几个核心的关键属性就差不多了，例如：

- `tag`属性即这个`VNode`的标签属性
- `data`属性包含了最后渲染成真实 dom 节点后，节点上的`class`，`attribute`，`style`以及绑定的事件
- `children`属性是`VNode`的子节点
- `text`属性是文本属性
- `elm`属性为这个`VNode`对应的真实 dom 节点
- `key`属性是`VNode`的标记，在`diff`过程中可以提高`diff`的效率

`Virtual DOM`除了它的数据结构的定义，映射到真实的 DOM 实际上要经历`VNode`的`create`、`diff`、`patch`等过程
