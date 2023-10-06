<center><h1>Vue常见优化手段</h1></center>

## 使用 Key

对于通过循环生成的列表，应给每个列表项一个稳定且唯一的 Key，这有利于在列表变动时，尽量少的删除、新增、改动元素

## 使用冻结的对象

冻结的对象不会被响应化，如果对象很多，嵌套结构很深，遍历过程需要花费很多时间，如果对象不需要动态更改，可以使用冻结对象

```js
const obj = { a: 1, b: 2 }
// 冻结对象
Object.freeze(obj)

// 尝试更改
obj.a = 3
console.log(obj) // 打印 {a:1, b:2}

// 验证
Object.isFrozen(obj) // 结果为 true
```

## [使用函数式组件](https://v2.cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)

函数式组件，被标记`functional: true`的组件。

函数式组件没有`data`，它只是一个接受一些`prop`的函数，这意味着它无状态（没有响应式数据），也没有实例(没有`this`上下文)。

## 使用计算属性

如果模板中某个数据会使用多次，别且该数据是通过计算得到的，使用计算属性以缓存它们

## 非实时绑定的表单项

当使用`v-model`绑定一个表单项时，当用户改变表单项的状态时，也会随之改变数据，从而导致 Vue 发生「**重渲染（rerender）**」，这会带来一些性能的开销

我们可以通过使用`lazy`或不使用`v-model`的方式解决该问题，但要注意，这样可能会导致在某一个时间段内数据和表单项是不一致的

Vue 设计思想关注的是数据而不是界面，代码的可维护性和可阅读性也很重要，JS 执行和浏览器渲染主线程是互斥的，所以运行动画时执行 JS 会导致动画卡顿

如双向绑定的文本框输入的内容改变，输入 abcd，会进行**4 次**重新渲染，可以使用`v-model.lazy`监听`@change`，不使用则监听的是`@input`

## 保持对象引用稳定

在绝大部分情况下，Vue 触发「**重渲染**」的时机是其依赖的数据发送**变化**

若数据没有发生变化，哪怕给数据重新赋值了，Vue 也是不会做出任何处理的

下面是 Vue 判断数据**有没有变化**的源码

```js
function hasChanged(x, y) {
  if (x === y) {
    return x === 0 && 1 / x !== 1 / y
  } else {
    return x === x || y === y
  }
}
```

因此，如果需要，只要能保证组件的依赖数据不发生变化，组件就不会重新渲染

对于原始数据类型，保持其值不变即可；对于对象类型，保持其引用地址不变即可

从另一方面来说，由于可以通过保持属性引用稳定来避免子组件的重渲染，那么我们应该细分组件来尽量避免多余的渲染

## 使用`v-show`替代`v-if`

对于频繁切换显示状态的元素，使用`v-show`可以保证虚拟 dom 树的稳定，避免频繁的新增和删除元素，特别是对于那些内部包含大量 dom 元素的节点，这一点极其重要

关键字：频繁切换显示状态、内部包含大量 dom 元素

## 使用延迟装载(`defer`)

JS 传输完成后，浏览器开始执行 JS 构造页面

但可能一开始要渲染的组件太多，不仅 JS 执行的时间很长，而且执行完成后浏览器要渲染的元素过多，从而导致页面白屏

一个可行的办法就是「**延迟装载组件**」，让组件按照指定的先后顺序依次一个一个的渲染出来

> 延迟装载时一个思路，本质上就是利用[`requestAnimationFrame`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)事件分批渲染内容，它的具体实现多种多样

告诉浏览器，你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

`callback`：下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)参数，该参数与[`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)的返回值相同，它表示`requestAnimationFrame()`开始去执行回调函数的时刻。

思路：**浏览器渲染 1 秒渲染 60 次，第一次渲染一部分，第二次一部分，隔开渲染,分批绘制**

::: code-group

```vue [App.vue]
<template>
  <div class="main">
    <div class="block" v-for="n in 21" :key="n">
      <HeavyComp v-if="defer(n * 5)" :num="n"></HeavyComp>
    </div>
  </div>
</template>

<script>
import HeavyComp from './components/HeavyComp.vue'
import defer from './mixins/defer'

export default {
  name: 'App',
  components: {
    HeavyComp
  },
  mixins: [defer()]
}
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.block {
  border: 2px solid #f00;
}
</style>
```

```vue [HeavyComp.vue]
<template>
  <div class="container">
    <div class="item" v-for="n in 5000" :key="n"></div>
    <div class="num">{{ num }}</div>
  </div>
</template>

<script>
export default {
  props: ['num']
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.item {
  width: 2px;
  height: 2px;
  background-color: #ccc;
  margin: 0.1rem;
}
.num {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 40px;
  color: #000;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
```

```js [defer.js]
/**
 * 延迟装载
 * @param {number} maxFrameCount 浏览器最大重绘次数,默认300次
 * @returns
 */
export default function (maxFrameCount = 300) {
  return {
    data() {
      return {
        // 浏览器的重绘次数
        frameCount: 0
      }
    },
    mounted() {
      const refreshFrameCount = () => {
        requestAnimationFrame(() => {
          this.frameCount++
          if (this.frameCount < maxFrameCount) {
            refreshFrameCount()
          }
        })
      }
      refreshFrameCount()
    },
    methods: {
      /**
       * 延迟指定重绘次数后才让组件显示
       * @param {number} showInFrameCount 延迟重绘次数
       * @returns {boolean}
       */
      defer(showInFrameCount) {
        return this.frameCount >= showInFrameCount
      }
    }
  }
}
```

:::

## 使用`keep-alive`

用于缓存内部组件实例，里面有`include`和`exclude`属性，`max`设置最大缓存数，超过后，自动删除最久没用的。

受到`keep-alive`影响，其内部的组件都具有两个生命周期，`activated`和`deactivated`，分别在组件激活和失活时触发，第一次`activated`是在`mounted`之后

一般用在需要多个页面频繁操作的场景（导航条）

## 打包体积优化

- `Webpack`对图片进行压缩
- 静态资源的优化使用对象存储加 CDN
- 减少 ES6 转为 ES5 的冗余代码
- 提取公共代码
- 模板预编译
- 提取组件的 CSS
- 优化`SourceMap`
- 构建结果输出分析
- Vue 项目的编译优化

## 长列表优化

一般用在 app 端下拉的时候，或者列表很长的时候，通过一个固定大小的渲染池来解决。通过滚动条等一些操作，减少页面渲染时长，有现成的库 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)

通过`v-once`创建低开销的静态组件，渲染一次后就缓存起来了，除非你非常留意渲染速度，不然最好不要用，因为有的开发者不知道这个属性或者看漏了，然后花费好几个小时来找为什么模板无法正确更新
