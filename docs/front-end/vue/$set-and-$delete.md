---
title: Vue的$set和$delete
---

## `$set`

### 对象的情况

对于使用`Object.defineProperty`实现响应式的对象，当我们去给这个对象添加一个新的属性的时候，是不能够触发它的`setter`的，比如：

```js
var vm = new Vue({
  data: {
    a: 1
  }
})
vm.b = 2 // vm.b 是非响应的
```

但是添加新属性的场景我们在平时开发中会经常遇到，那么`Vue`为了解决这个问题，定义了一个全局 API`Vue.set`方法

```ts
export function set<T>(array: T[], key: number, value: T): T
export function set<T>(object: object, key: string | number, value: T): T
export function set(target: any[] | Record<string, any>, key: any, val: any): any {
  if (__DEV__ && (isUndef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }
  if (isReadonly(target)) {
    __DEV__ && warn(`Set operation on key "${key}" failed: target is readonly.`)
    return
  }
  const ob = (target as any).__ob__
  if (isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key) // 最大值为长度
    target.splice(key, 1, val) // 移除一位，异变方法派发更新
    if (ob && !ob.shallow && ob.mock) {
      observe(val, false, true)
    }
    return val
  }
  // key属于target
  if (key in target && !(key in Object.prototype)) {
    target[key] = val // 赋值操作触发set
    return val
  }
  if ((target as any)._isVue || (ob && ob.vmCount)) {
    __DEV__ &&
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
      )
    return val
  }
  // 普通对象赋值操作
  if (!ob) {
    target[key] = val
    return val
  }
  // 将新值包装为响应式
  defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock)
  if (__DEV__) {
    ob.dep.notify({
      type: TriggerOpTypes.ADD,
      target: target,
      key,
      newValue: val,
      oldValue: undefined
    })
  } else {
    ob.dep.notify() // 手动触发通知
  }
  return val
}
```

`set`方法接收 3 个参数

- `target`：可能是数组或者是普通对象
- `key`：代表的是数组的下标或者是对象的键值
- `val`：代表添加的值

首先判断`target`是否为数组且`key`是一个合法的下标，如果是则通过`splice`添加进数组然后返回，这里的`splice`其实已经不仅仅是原生数组的`splice`了，稍后会详细介绍数组的逻辑

接着又判断`key`是否已经存在于`target`中，如果是则直接赋值返回，因为这样的变化是可以观测到了

接着再判断`ob`的值是否存在，之前分析过它是在`Observer`的构造函数执行的时候初始化的，表示`Observer`的一个实例，如果它不存在，则说明`target`不是一个响应式的对象，则直接赋值并返回

最后通过`defineReactive(ob.value, key, val)`把新添加的属性变成响应式对象，然后再通过`ob.dep.notify()`手动的触发依赖通知，还记得我们在给对象添加`getter`的时候有这么一段逻辑：

```ts
export function defineReactive(
  obj: object,
  key: string,
  val?: any,
  customSetter?: Function | null,
  shallow?: boolean,
  mock?: boolean
) {
  // ...
  let childOb = !shallow && observe(val, false, mock)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        if (__DEV__) {
          dep.depend({
            target: obj,
            type: TrackOpTypes.GET,
            key
          })
        } else {
          dep.depend()
        }
        if (childOb) {
          childOb.dep.depend()
          if (isArray(value)) {
            dependArray(value)
          }
        }
      }
      return isRef(value) && !shallow ? value.value : value
    }
    // ...
  })
  return dep
}
```

在`getter`过程中判断了`childOb`，并调用了`childOb.dep.depend()`收集了依赖，这就是为什么执行`Vue.set`的时候通过`ob.dep.notify()`能够通知到`watcher`，从而让添加新的属性到对象也可以检测到变化。这里如果`value`是个数组，那么就通过`dependArray`把数组每个元素也去做依赖收集

### 数组的情况

接着说一下数组的情况，`Vue`也是不能检测到以下变动的数组：

1. 当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

对于第一种情况，可以使用：`Vue.set(example1.items, indexOfItem, newValue)`；而对于第二种情况，可以使用`vm.items.splice(newLength)`

我们刚才也分析到，对于`Vue.set`的实现，当`target`是数组的时候，也是通过`target.splice(key, 1, val)`来添加的，那么这里的`splice`到底有什么黑魔法，能让添加的对象变成响应式的呢

其实之前我们也分析过，在通过`observe`方法去观察对象的时候会实例化`Observer`，在它的构造函数中是专门对数组做了处理

```ts
export class Observer {
  dep: Dep
  vmCount: number // number of vms that have this object as root $data
  constructor(
    public value: any,
    public shallow = false,
    public mock = false
  ) {
    // this.value = value
    this.dep = mock ? mockDep : new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (isArray(value)) {
      if (!mock) {
        if (hasProto) {
          /* eslint-disable no-proto */
          ;(value as any).__proto__ = arrayMethods
          /* eslint-enable no-proto */
        } else {
          for (let i = 0, l = arrayKeys.length; i < l; i++) {
            const key = arrayKeys[i]
            def(value, key, arrayMethods[key])
          }
        }
      }
      if (!shallow) {
        this.observeArray(value)
      }
    } else {
      // ...
    }
  }
  // ...
}
```

这里我们只需要关注`value`是`Array`的情况，首先，这里的`hasProto`实际上就是判断对象中是否存在`__proto__`，如果存在则把`value.__proto__`原型修改为`arrayMethods`，否则就通过`def`，也就是`Object.defineProperty`去定义它自身的属性值。

对于大部分现代浏览器都会走进`hasProto`为`true`的情况，那么它实际上就把`value`的原型指向了`arrayMethods`。让我们看看`arrayMethods`是怎么定义的：

```ts
import { TriggerOpTypes } from '../../v3'
import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    if (__DEV__) {
      ob.dep.notify({
        type: TriggerOpTypes.ARRAY_MUTATION,
        target: this,
        key: method
      })
    } else {
      ob.dep.notify()
    }
    return result
  })
})
```

可以看到，`arrayMethods`首先继承了`Array`，然后对数组中所有能改变数组自身的方法，如`push`、`pop`等这些方法进行重写

重写后的方法会先执行它们本身原有的逻辑，并对能增加数组长度的 3 个方法`push`、`unshift`、`splice`方法做了判断，获取到插入的值，然后把新添加的值变成一个响应式对象，并且再调用`ob.dep.notify()`手动触发依赖通知

## `$delete`

先来看看`Vue.delete`方法的定义：

```ts
export function del<T>(array: T[], key: number): void
export function del(object: object, key: string | number): void
export function del(target: any[] | object, key: any) {
  if (__DEV__ && (isUndef(target) || isPrimitive(target))) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`)
  }
  if (isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target as any).__ob__
  if ((target as any)._isVue || (ob && ob.vmCount)) {
    __DEV__ &&
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.'
      )
    return
  }
  if (isReadonly(target)) {
    __DEV__ && warn(`Delete operation on key "${key}" failed: target is readonly.`)
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  if (__DEV__) {
    ob.dep.notify({
      type: TriggerOpTypes.DELETE,
      target: target,
      key
    })
  } else {
    ob.dep.notify()
  }
}
```

`delete`方法接收 2 个参数

- `target`：可能是数组或者是普通对象
- `key`：代表的是数组的下标或者是对象的键值

`delete`方法就更加简单了，首先判断`target`是数组就使用异变方法`splice`移除指定下标值；接着判断`target`是对象但`key`不属于它，那就什么都不做，属于的话就删除指定`key`的值。如果`target`不是响应式对象，删除的就是普通对象一个值，删了就删了，否则调用`ob.dep.notify()`通知手动依赖管理器派发更新视图
