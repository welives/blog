---
title: 模块导入导出
head:
  - - meta
    - name: description
      content: 模块导入导出
  - - meta
    - name: keywords
      content: js ES6 ESM commonJS module.exports exports export
---

::: tip

1. `module.exports`和`exports`是 commonJS 的规范
2. `export`和`export default`是 ES6 的规范
3. `require`是 AMD 规范的引入方式
4. `import`是 ES6 的一个语法标准

:::

|                | `export`    | `export default` | `module.exports`    |
| -------------- | ----------- | ---------------- | ------------------- |
| 来源           | ES6(ESM)    | ES6(ESM)         | commonJS            |
| 单文件存在个数 | 多个        | 一个             | 一个                |
| 导入方式       | `import {}` | `import xxx`     | `import`或`require` |

## ESM和commonJS 的主要区别

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

## `module.exports`和`exports`的使用

`module`代表当前文件是一个模块，这是一个对象，会创建`exports`属性，它的默认值是**空对象**

::: code-group

```js [index.js]
// 导入
const app = require('./app.js')
// 或这样
const { add, test } = require('./app.js')
```

```js [app.js]
function add(a, b) {
  return a + b
}
const test = 123
// 导出
module.export.add = add
module.export.test = 123

// 或这样
module.exports = { add, test }

// 或这样
module.export = (() => {
  return { add, test }
})()
```

:::

::: danger 注意
`exports`是`module.exports`的一个引用，它们都指向同一个内存地址，可以简单的理解为`var exports = module.exports`
:::

### `module.exports`和`exports`的区别

- `require`最终引入的其实都是`module.exports`，也就是真正执行导出的是`module.exports`
- `exports`不能导出匿名函数，因为它本身就是模块的一个属性，也不能写成`exports = { test }`，因为这样相当于给`exports`重新赋值，会改变它的引用地址
- `exports`是引用`module.exports`的值，`module.exports`被改变的时候，`exports`不会改变，看下面一个例子就知道

::: code-group

```js [output.js]
const test = require('./test')
const p = test.add
const b = test
console.log('p的值是：' + p) // p的值是：undefined
console.log('b的值是：' + b) // b的值是：1
```

```js [test.js]
exports.add = 100
module.exports = 1
```

:::

> 可以看到，在`module.exports`的内存地址改变后，以`exports.xxx`形式导出的值在其他文件中也无法调用了

## `export`和`export default`的使用

::: code-group

```js [index.js]
import test, { age } from './app'
test.say()
console.log(test.name, age)
```

```js [app.js]
const name = 'jandan'
const age = 18
const say = function () {
  console.log('hello world')
}

export { age }

// 一个模块文件只能有一个export default
export default { name, say }
```

:::

### `export`和`export default`的区别

- `export default`在一个模块中只能有一个，也可以没有，`export`可以有任意个
- `export default`导出的对象、变量、函数等可以没有具体的名字；而`export`导出的必须有名字
