---
title: JS继承
head:
  - - meta
    - name: description
      content: JS继承
  - - meta
    - name: keywords
      content: js extends 继承
---

## 原型链继承

原型链继承的基本原理就是把子类的原型对象重写为父类的实例

- 优点
  - 复用父类属性、方法
- 缺点
  - 「**子类实例**」共享父类中的引用类型
  - 不能向父类构造函数传参

::: details 示例

```js
function Mobile() {}
function Android() {}
Mobile.prototype._name = 'mobile'
Mobile.prototype.types = ['android', 'ios']
Mobile.prototype.getSystem = function (index) {
  console.log(`The system is ${this.types[index]}`)
}
// 重写子类的原型对象为父类的实例，Android.prototype.__proto__ == Mobile.prototype
Android.prototype = new Mobile()

const m = new Mobile()
const a = new Android()
a.types.push('harmony')
m.types.push('windows')
console.log(m) // Mobile
console.log(m.types) // ['android', 'ios', 'harmony', 'windows']
m.getSystem(2) // The system is harmony
console.log('=========')
console.log(a) // Android
console.log(a.types) // ['android', 'ios', 'harmony', 'windows']
a.getSystem(3) // The system is windows
console.log(Android.prototype) // Mobile
console.log(a instanceof Mobile) // true
```

:::

## 盗用构造函数(借助 call 或 apply)

盗用构造函数实现继承的原理是：在子函数上面执行了父函数的所有的代码，所以，通过子函数构造的每一个实例都拥有自己的继承自父函数的属性和方法，实例之间**不共享**引用类型

- 优点
  - 「**子类实例**」不共享父类中的引用类型
  - 可以向父类构造函数传参
- 缺点
  - 「**子类**」不能继承「**父类原型**」上的属性和方法
  - 子类不是父类的实例，故而`instanceof`无法检测

::: details 示例

```js
function Mobile(type) {
  this._name = 'mobile'
  this.types = ['android', 'ios']
  if (type) {
    this.types.push(type)
  }
  this.getSystem = function (index) {
    console.log(`The system is ${this.types[index]}`)
  }
}
function Android(type) {
  this._name = 'android' // 测试覆盖
  Mobile.call(this, type)
  // 为确保父函数的属性不覆盖子函数的属性，子函数定义的属性在父函数调用之后声明
  this.brand = 'huawei'
}

const m = new Mobile()
const a = new Android('harmony')
m.types.push('windows')
console.log(m) // Mobile {_name: 'mobile', types: Array(3), getSystem: ƒ}
console.log(m.types) // ['android', 'ios', 'windows']
m.getSystem(2) // The system is windows
console.log('=========')
console.log(a) // Android {_name: 'mobile', types: Array(3), getSystem: ƒ, brand: 'huawei'}
console.log(a.types) // ['android', 'ios', 'harmony']
a.getSystem(2) // The system is harmony
console.log(Android.prototype) // {constructor: ƒ}
console.log(a instanceof Mobile) // false
```

:::

## 组合继承(原型链继承+盗用构造函数)

组合继承综合了原型链和盗用构造函数两种方式，基本的实现是，通过原型链继承父类原型上的属性和方法，通过盗用构造函数继承实例属性

- 子类的每一个实例通过盗用构造函数，把子类的构造函数扩展了，所以，所有子类构造的对象在`new`时，所有的属性都是**实例独有的**，不在实例间共享，解决了原型链中实例共享引用类型的情况
- 通过重写子类的原型对象为父类实例，从而继承了父类原型上的属性和方法，弥补了盗用构造函数的不足

> 组合继承中，在重写子类原型对象为父类实例后，还需要手动修复子类的构造函数为自己

- 优点
  - 保留构造函数：可以向父类传参
  - 保留原型链：父类实例原型上的属性和方法公用
  - 父类构造函数中的引用类型不共享
- 缺点
  - 父类构造函数中的属性存在实例以及原型上

::: details 示例

```js
function Mobile(type) {
  this._name = 'mobile'
  this.types = ['android', 'ios']
  if (type) {
    this.types.push(type)
  }
}
Mobile.prototype.getSystem = function (index) {
  console.log(`The system is ${this.types[index]}`)
}
function Android(brand, type) {
  Mobile.call(this, type)
  this.brand = brand
}
Android.prototype = new Mobile()
Android.prototype.constructor = Android // 修复子类构造函数
Android.prototype.showBrand = function () {
  console.log(this.brand)
}

const m = new Mobile()
const a = new Android('xiaomi', 'windows')
const b = new Android('huawei', 'harmony')
console.log(Mobile.prototype) // {getSystem: ƒ, constructor: ƒ}
console.log(Android.prototype) // Mobile {_name: 'mobile', types: Array(2), constructor: ƒ, showBrand: ƒ}
console.log('=========')
console.log(m) // Mobile {_name: 'mobile', types: Array(2)}
console.log(m.types) // ['android', 'ios']
console.log('=========')
console.log(a) // Android {_name: 'mobile', types: Array(3), brand: 'xiaomi'}
console.log(a.types) // ['android', 'ios', 'windows']
a.getSystem(2) // The system is windows
a.showBrand() // xiaomi
console.log(a instanceof Mobile) // true
console.log('=========')
console.log(b) // Android {_name: 'mobile', types: Array(3), brand: 'huawei'}
console.log(b.types) // ['android', 'ios', 'harmony']
b.getSystem(2) // The system is harmony
console.log(b instanceof Mobile) // true
b.showBrand() // huawei
```

:::

## 原型式继承

原型式继承的使用场景是：有一个对象，想在它的基础上创建一个新的对象，新对象能够访问到原有对象的属性和方法

> ES5 的 `Object.create`方法实现同样的功能

- 缺点
  - 创建出来的对象共享父类中的引用类型

::: details 示例

```js
function Create(obj) {
  function F() {}
  F.prototype = obj
  F.prototype.constructor = F
  return new F()
}

const m = {
  name: 'mobile',
  types: ['android', 'ios'],
  say: function () {
    console.log(`I am ${this.name}`)
  },
}
const a = Create(m)
const b = Object.create(m)
a.name = 'android'
a.types.push('harmony')
b.types.push('windows')
console.log(m) // {name: 'mobile', types: Array(4), say: ƒ, constructor: ƒ}
console.log(m.types) // ['android', 'ios', 'harmony', 'windows']
console.log('=========')
console.log(a) // F {name: 'android'}
console.log(a.types) // ['android', 'ios', 'harmony', 'windows']
a.say() // I am android
console.log('=========')
console.log(b) // F
console.log(b.types) // ['android', 'ios', 'harmony', 'windows']
b.say() // I am mobile
```

:::

## 寄生式继承

使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作寄生式继承

- 优点
  - 保留原型链：父类实例原型上的方法公用
- 缺点
  - 创建出来的对象共享父类中的引用类型
  - 给对象新添加的方法难以重用

::: details 示例

```js
function Create(obj) {
  const clone = Object.create(obj)
  clone.getSystem = function (index) {
    console.log(`The system is ${this.types[index]}`)
  }
  return clone
}

const obj = {
  name: 'xiaomi',
  types: ['android', 'ios'],
}
const a = Create(obj)
obj.say = function () {
  console.log(`I am ${this.name}`)
}
a.name = 'huawei'
a.types.push('harmony')
console.log(obj) // {name: 'xiaomi', types: Array(3), say: ƒ}
console.log(obj.types) // ['android', 'ios', 'harmony']
obj.say() // I am xiaomi
console.log('=========')
console.log(a) // {getSystem: ƒ, name: 'huawei'}
console.log(a.types) // ['android', 'ios', 'harmony']
a.getSystem(2) // The system is harmony
a.say() // I am huawei
```

:::

## 寄生组合式继承

将组合继承和寄生式继承结合起来，得出了寄生组合式的继承，这种方式解决了组合继承调用两次父构造函数的情况

::: details 示例

```js
function Mobile(type) {
  this._name = 'mobile'
  this.types = ['android', 'ios']
  if (type) {
    this.types.push(type)
  }
}
Mobile.prototype.getSystem = function (index) {
  console.log(`The system is ${this.types[index]}`)
}
function Android(brand, type) {
  Mobile.call(this, type)
  this.brand = brand
}
function inheritPrototype(parent, child) {
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
}
inheritPrototype(Mobile, Android)
Android.prototype.showBrand = function () {
  console.log(this.brand)
}

const m = new Mobile()
const a = new Android('xiaomi', 'windows')
const b = new Android('huawei', 'harmony')
console.log(Mobile.prototype) // {getSystem: ƒ, constructor: ƒ}
console.log(Android.prototype) // Mobile {constructor: ƒ, showBrand: ƒ}
console.log('=========')
console.log(m) // Mobile {_name: 'mobile', types: Array(2)}
console.log(m.types) // ['android', 'ios']
console.log('=========')
console.log(a) // Android {_name: 'mobile', types: Array(3), brand: 'xiaomi'}
console.log(a.types) // ['android', 'ios', 'windows']
a.getSystem(2) // The system is windows
a.showBrand() // xiaomi
console.log(a instanceof Mobile) // true
console.log('=========')
console.log(b) // Android {_name: 'mobile', types: Array(3), brand: 'huawei'}
console.log(b.types) // ['android', 'ios', 'harmony']
b.getSystem(2) // The system is harmony
b.showBrand() // huawei
console.log(b instanceof Mobile) // true
```

:::

## ES6 的 `class`和`extends`

寄生组合式继承就是目前 ES6 的`class`和`extends`的实现方式

::: details 示例

```js
class Mobile {
  constructor(type) {
    this._name = 'mobile'
    this.types = ['android', 'ios']
    if (type) {
      this.types.push(type)
    }
  }
  static say() {
    console.log(`I am ${this.name}`)
  }
  getSystem(index) {
    console.log(`The system is ${this.types[index]}`)
  }
}

class Android extends Mobile {
  constructor(brand, type) {
    super(type)
    this.brand = brand
  }
  showBrand() {
    console.log(this.brand)
  }
}

const m = new Mobile()
const a = new Android('huawei', 'harmony')
console.log(Mobile.prototype) // {constructor: ƒ, getSystem: ƒ}
Mobile.say() // I am Mobile
console.log(Android.prototype) // Mobile {constructor: ƒ, showBrand: ƒ}
Android.say() // I am Android
console.log('=========')
console.log(m) // Mobile {_name: 'mobile', types: Array(2)}
console.log(m.types) // ['android', 'ios']
console.log('=========')
console.log(a) // Android {_name: 'mobile', types: Array(3), brand: 'huawei'}
console.log(a.types) // ['android', 'ios', 'harmony']
a.getSystem(2) // The system is harmony
a.showBrand() // huawei
console.log(a instanceof Mobile) // true
```

:::
