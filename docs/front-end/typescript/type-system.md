---
title: TypeScript类型系统
head:
  - - meta
    - name: description
      content: TypeScript类型系统
  - - meta
    - name: keywords
      content: typescript 类型系统
---

> [微软官方的 TypeScript 学习中心](https://learn.microsoft.com/zh-cn/training/paths/build-javascript-applications-typescript/)

## 联合类型

联合类型描述的值可以是几种类型之一。联合类型将赋值限制为联合中的指定类型，使用竖线`|`分隔每种类型

```ts
let multiType: number | boolean
multiType = 20 // OK
multiType = true // OK
multiType = 'twenty' // Error
```

## 交叉类型

交叉类型与联合类型密切相关，但它们的使用方式不同。交叉类型组合两个或多个类型以创建具有现有类型的所有属性的新类型，交叉类型使用与号`&`分隔每种类型

```ts
interface Employee {
  employeeID: number
  age: number
}
interface Manager {
  stockPlan: boolean
}
type ManagementEmployee = Employee & Manager
let newManager: ManagementEmployee = {
  employeeID: 12345,
  age: 34,
  stockPlan: true,
}
```

## 字面量类型

字面量类型表示一组可能的值，即枚举类型。TypeScript 中提供了三组字面量类型：`string`、`number` 和 `boolean`

```ts
type testResult = 'pass' | 'fail' | 'incomplete'
let myResult: testResult
myResult = 'incomplete' // OK
myResult = 'pass' // OK
myResult = 'failure' // Error
```

::: warning 注意
字面量类型和交叉类型结合使用时，则变成提取相同的部分，类似[Extract](#extract)

```ts
type Test1 = (string | object | boolean) & number // never
type Test2 = (string | object | boolean) & boolean // boolean
```

:::

## 接口`interface`

```ts
interface IceCream {
  flavor: string
  scoops: number
}
// 扩展接口
interface Sundae extends IceCream {
  sauce: 'chocolate' | 'caramel' | 'strawberry'
  nuts?: boolean
  whippedCream?: boolean
  instructions?: boolean
}
```

## 接口(`interface`)与类型别名(`type`)的区别

类型别名是数据类型（例如联合、基元、交集、元组或其他任何类型）的定义。 另一方面，接口是描述数据形状（例如对象）的一种方法。 类型别名可以像接口一样使用；但有一些细微的差异。 主要区别在于，不能重新打开类型别名以添加新属性，而接口始终是可扩展的。 此外，只能使用类型别名描述并集或元组

## Record

定义一个对象的 key 和 value 类型

::: code-group

```ts [示例]
type NeverObj = Record<string, never> // 空对象
type AnyObj = Record<string, unknown> // 任意对象
type UserInfo = {
  name: string
  email: string
}
const user: Record<string, UserInfo> = {
  uid1: { name: 'john', email: 'john@gmail.com' },
}
```

```ts [源码]
type Record<K extends string | number | symbol, T> = { [P in K]: T }
```

:::

## Partial

将某个类型里的所有属性变成可选，并返回新类型

::: code-group

```ts [示例]
interface Todo {
  title: string
  desc: string
}
const todo: Partial<Todo> = { title: 'Learn TypeScript' }
```

```ts [源码]
type Partial<T> = { [P in keyof T]?: T[P] }
```

:::

## Required

将某个类型里的所有属性变成必选，并返回新类型

::: code-group

```ts [示例]
interface Todo {
  title?: string
  desc?: string
}
const todo: Required<Todo> = { title: 'Learn TypeScript', desc: '学习类型处理' }
```

```ts [源码]
type Required<T> = { [P in keyof T]-?: T[P] }
```

:::

## Pick

从某个类型中取出部分属性，并返回新类型

::: code-group

```ts [示例]
interface User {
  id: number
  readonly name: string
  age: number
  sex: 0 | 1
}
const user: Pick<User, 'id' | 'name'> = { id: 1, name: 'jandan' }
```

```ts [源码]
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
```

:::

## Omit

从某个类型中省略部分属性，并返回新类型

::: code-group

```ts [示例]
interface User {
  id: number
  readonly name: string
  age: number
  sex: 0 | 1
}
const user: Omit<User, 'age' | 'sex'> = { id: 1, name: 'jandan' }
```

```ts [源码]
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

:::

## Exclude

类型排除，通常用于复杂类型。它接受两个类型参数，从`参数1`中排除掉`参数2`类型中的所有属性(`说人话就是过滤出参数1中独有的属性`)，并返回新类型

::: code-group

```ts [示例]
type A = object | string | number | boolean
type B = number | boolean
type C = Exclude<A, B> // string | object
type D = Exclude<B, A> // never

type Shapes =
  | {
      kind: 'circle'
      radius: number
    }
  | {
      kind: 'square'
      x: number
    }
// 如果这里使用 Omit 的话会报错,因为无法处理复杂类型
type ExcludedShapes = Exclude<Shapes, { kind: 'circle' }>
```

```ts [源码]
type Exclude<T, U> = T extends U ? never : T
```

:::

## Extract

类型提取，与`Exclude`正好相反，通常用于复杂类型。它接受两个类型参数，从`参数1`中提取出`参数2`的相同部分(`说人话就是过滤出两个参数之间相同的属性`)，并返回新类型

::: code-group

```ts [示例]
type A = string | object | boolean
type B = number | boolean
type C = number
type D = Extract<A, B> // boolean
type E = Extract<A, C> // never

type Shapes =
  | {
      kind: 'circle'
      radius: number
    }
  | {
      kind: 'square'
      x: number
    }
// 如果这里使用 Pick 的话会报错,因为无法处理复杂类型
type ExtractedShapes = Extract<Shapes, { kind: 'circle' }>
```

```ts [源码]
type Extract<T, U> = T extends U ? T : never
```

:::

## Parameters

以元组的方式获得函数的入参类型

::: code-group

```ts [示例]
function handle(name: string) {}
type HandleType = Parameters<typeof handle> // [string]
type ArrowFuncType = Parameters<(count: number) => any> // [number]
```

```ts [源码]
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
```

:::

## ReturnType

获得函数返回值的类型

::: code-group

```ts [示例]
const func = () => 'jandan'
const async_func = async () => 'jandan'

// 得到函数的类型
type FuncType = typeof func // () => string
// 得到函数的返回值类型
type FuncReturn = ReturnType<FuncType> // string
type FuncReturn = ReturnType<typeof func> // string
// 如果是异步函数的话
type PromiseReturn = ReturnType<typeof async_func> // Promise<string>
type AsyncReturn = Awaited<ReturnType<typeof async_func>> // string
```

```ts [源码]
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

:::

## 函数重载

在 JavaScript 中，根据传入不同的参数调用同一个函数，返回不同类型的值是常见的情况。TypeScript 通过为同一个函数提供多个函数类型定义来实现这个功能

```ts
// 定义了两个重载,在函数实现部分同时处理两种情况
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''))
  }
  if (typeof x === 'string') {
    return x.split('').reverse().join('')
  }
  throw new Error('Parameters must be number or string')
}

reverse(12345) // 54321
reverse('hello') // olleh
```

## 从现有对象中获取类型

```ts
const obj = {
  name: 'jandan',
  age: 30,
}
// 得到对象的类型
type Person = typeof obj
// 得到对象中有哪些属性
type Props = keyof Person
type Props = keyof typeof obj
// 根据传入对象,提示其有哪些属性
function handle<T extends object, K extends keyof T>(obj: T, prop: K) {}
```

## 疑难杂症

#### 互斥类型

给定两个类型，它们只能同时出现一个，不能同时出现两个或都不出现。

```ts
/**
 * @see https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

// 例子
interface Person {
  ethnicity: string
}
interface Pet {
  breed: string
}
function getOrigin(value: XOR<Person, Pet>) {}
getOrigin({ ethnicity: 'Chinese' }) // OK
getOrigin({ breed: 'Pug' }) // OK
getOrigin({}) // Error
getOrigin({ ethnicity: 'Chinese', breed: 'Pug' }) // Error
```

#### 限制传入对象必须包含某些字段

```ts
type MustKeys = 'key1' | 'key2'
function test<T extends MustKeys extends keyof T ? any : never>(obj: T) {}

test({}) // Error
test({ key1: 'a' }) // Error
test({ key1: 'a', key2: 1, key3: 123 }) // OK
```

#### 使用`infer`来做类型「解构」

```ts
type PromiseInnerType<T extends Promise<any>> = T extends Promise<infer P> ? P : never
type PromiseType = PromiseInnerType<Promise<string>> // string

// ReturnType的Promise版本
type PromiseReturnType<T extends () => any> = ReturnType<T> extends Promise<infer R>
  ? R
  : ReturnType<T>
const test = async () => ({ a: 1 })
type TestReturn = PromiseReturnType<typeof test> // { a: number }
```

#### 将联合类型转成交叉类型

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type Intersection = UnionToIntersection<{ a: string } | { b: number }> // { a: string } & { b: number }
```

#### 将交叉类型扁平化

```ts
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
// 或者这样简写
type Prettify<T> = { [P in keyof T]: T[P] } & {}

type Test = Prettify<{ a: string } & { b: number } & { c: boolean }> // { a: string; b: number; c: boolean }
```

#### 从一个函数数组中获取所有函数返回值的合并类型

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
type Prettify<T> = T extends object ? { [K in keyof T]: T[K] } : never
type InjectTypes<T extends Array<() => object>> = T extends Array<() => infer P>
  ? Prettify<UnionToIntersection<P>>
  : never

// 例子
function injectUser() {
  return { user: 1 }
}
function injectBook() {
  return { book: '2' }
}
const injects = [injectUser, injectBook]
type Test = InjectTypes<typeof injects> // { user: number, book: string }
```

#### `...args`函数不定参数 + 泛型

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
type Prettify<T> = T extends object ? { [K in keyof T]: T[K] } : never
type InjectTypes<T extends Array<() => object>> = T extends Array<() => infer P>
  ? Prettify<UnionToIntersection<P>>
  : never

// 例子
function injectUser() {
  return { user: 1 }
}
function injectBook() {
  return { book: '2' }
}
function getInjectData<T extends Array<() => any>>(...injects: T): InjectTypes<T> {
  const data: any = {}
  for (let inject of injects) Object.assign(data, inject())
  return data
}
getInjectData(injectUser, injectBook) // { user: number, book: string }
```

#### 引用某个类型的子类型

```ts
type Parent1 = { fun<T>(): T }
type Parent2 = { [key: string]: number }
type Child1 = Parent1['fun']
type Child2 = Parent2[string]
```

#### 让对象本身就是它的「字面量类型」

```ts
const obj = { a: 1, b: '2' } as const
```

#### 禁止泛型被自动推导，让泛型成为必填项

```ts
/**
 * @see https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-504042546
 */
type NoInfer<T> = [T][T extends any ? 0 : never]

// 例子
class Test<P = never> {
  constructor(data: NoInfer<P>) {}
}
new Test('jandan') // Error
new Test<string>('jandan') // OK

function test<P = never>(data: NoInfer<P>) {}
test(1) // Error
test<number>(1) // OK
```
