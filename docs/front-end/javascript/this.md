---
title: this指向
head:
  - - meta
    - name: description
      content: this指向
  - - meta
    - name: keywords
      content: js this 指向 七步口诀 箭头函数
---

::: tip 速记七步口诀
`箭头函数`、`new`、`bind`、`apply和call`、`obj.`、`直接调用`、`不在函数里`
:::

## 箭头函数 {#arrow-function}

箭头函数排在第一个是因为它的 this 不会被改变，所以只要当前函数是箭头函数，那么就不用再看其他规则了

箭头函数的`this`是在创建它时外层`this`的指向

- **创建箭头函数时**，就已经确定了它的`this`指向
- 箭头函数内的`this`指向**外层的`this`**

所以要知道箭头函数的`this`就得先知道外层`this`的指向，需要继续在外层应用七步口诀

## `new`

当使用`new`关键字调用函数时，函数中的`this`一定是 JS 创建的新对象

::: warning 注意
箭头函数不能作为构造函数，也就不能和`new`一起使用
:::

## `bind`

`bind`是指[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

- 多次`bind`时只认第一次`bind`的值

```js
function func() {
  console.log(this)
}
func.bind(1).bind(2)() // 1
```

- 箭头函数中`this`不会被修改

```js
func = () => {
  // 这里的 this 指向取决于外层 this，参考口诀 7 「不在函数里」
  console.log(this)
}
func.bind(1)() // Window
```

- `bind`与`new`

```js
function func() {
  console.log(this, this.__proto__ === func.prototype)
}
bindFunc = func.bind(1)
new bindFunc() // Object true, 口诀 2 「new」优先
```

## `apply`和`call` {#apply-and-call}

`apply()`和`call()`的第一个参数都是`this`，区别在于通过`apply`调用时实参是放到数组中的，而通过`call`调用时实参是逗号分隔的

- 箭头函数中`this`不会被修改

```js
func = () => {
  // 这里的 this 指向取决于外层 this，参考口诀 7 「不在函数里」
  console.log(this)
}
func.apply(1) // Window
```

- `bind`函数中`this`不会被修改

```js
function func() {
  console.log(this)
}
bindFunc = func.bind(1)
bindFunc.apply(2) // 1, 口诀 3 「bind」优先
```

## `obj.` {#obj}

```js
function func() {
  console.log(this.x)
}
obj = { x: 1 }
obj.func = func
obj.func() // 1
```

## 直接调用

在函数不满足前面的场景，被直接调用时，`this`将指向全局对象。在浏览器环境中全局对象是`Window`，在 Node.js 环境中是`Global`

```js
function outerFunc() {
  console.log(this) // { x: 1 }
  function func() {
    console.log(this) // Window
  }
  func()
}
outerFunc.bind({ x: 1 })()
```

## 不在函数里

不在函数中的场景，可分为浏览器的`<script />`标签里，或 Node.js 的模块文件里

- 在`<script />`标签里，`this`指向`Window`
- 在 Node.js 的模块文件里，`this`指向`Module`的默认导出对象，也就是`module.exports`

### 非严格模式

严格模式是在 ES5 提出的。在 ES5 规范之前，也就是非严格模式下，`this`不能是`undefined`或`null`

所以**在非严格模式下，通过上面七步口诀，如果得出`this`指向是`undefined`或`null`，那么`this`会指向全局对象**。在浏览器环境中全局对象是`Window`，在 Node.js 环境中是`Global`

```js
function func() {
  console.log('function func:', this)
  ;(() => {
    console.log('arrow function: ', this)
  })()
}
func()
func.bind(null)()
func.bind(undefined)()
func.bind().bind(2)()
func.apply()
```

::: warning 注意
七步口诀在严格模式下和非严格模式下都是完备的，只是在非严格模式下`null`或`undefined`会被转换为全局对象，所以没有将这点列入口诀中
:::
