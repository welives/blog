## 初始化

先来看看源码中是怎么初始化的：

```ts
export function initState(vm: Component) {
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  // ...
}

function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {} // 获取Vue实例选项上的Props
  const props = (vm._props = shallowReactive({})) // 获取挂载Vue实例上的_props
  const keys: string[] = (vm.$options._propKeys = []) // Props的Key值组成的数组
  const isRoot = !vm.$parent
  if (!isRoot) {
    toggleObserving(false) // 非根实例关闭依赖监听
  }
  // 循环遍历 vue 实例选项中Props，并且执行响应式处理以及挂载在对应实例上
  for (const key in propsOptions) {
    keys.push(key) // 每遍历一次props中的值，都会收集其Key
    // 先校验Props中定义的数据类型是否符合，符合的话就直接返回，并且直接赋值给Vue实例上_props对象中相应的属性中
    const value = validateProp(key, propsOptions, propsData, vm)
    if (__DEV__) {
      // ...
    } else {
      defineReactive(props, key, value) // 执行响应式处理
    }
    // 遍历时若发现新属性时，就将新属性重新挂载到Vue实例的_props中
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true) // 打开依赖监听
}
```

- `defineReactive`：相信对这个函数应该都不会陌生，其实就是对`Vue`实例上的`_props`对象中每一个属性都配置成响应式的，这样一来，当父组件中传递进来的`Props`变化时，则会通知子组件进行更新
- `proxy`：在遍历的过程中，一旦发现有新的属性时，都会将新属性重新挂载到`Vue`实例的`_props`中。这里有一个很重要的知识点，当我们直接访问一个`Props`中的属性时，其实是直接访问了`Vue`实例的`_props`对象中的值而已

至此，我们也知道`Vue`源码是如何实现初始化`Props`的了，那么，究竟父组件是如何通知更新`Props`的呢？我们接着看下去

## 更新

由于父组件在更新的过程中，会通知子组件也进行更新，这时候就会调取一个方法`updateChildComponent`，而这个方法里就会对`Props`进行更新。我们就来看看是如何处理的：

```ts
export function updateChildComponent(
  vm: Component,
  propsData: Record<string, any> | null | undefined,
  listeners: Record<string, Function | Array<Function>> | undefined,
  parentVnode: MountedComponentVNode,
  renderChildren?: Array<VNode> | null
) {
  // ...
  if (propsData && vm.$options.props) {
    toggleObserving(false) // 关闭依赖监听
    const props = vm._props // 获取Vue实例上_props对象
    const propKeys = vm.$options._propKeys || [] // 获取保留在Vue实例上的props key值
    // 循环遍历props key
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      // 先校验Props中定义的数据类型是否符合，符合的话就直接返回，并且直接赋值给Vue实例上_props对象中相应的属性中
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true) // 打开依赖监听
    // keep a copy of raw propsData
    vm.$options.propsData = propsData // 新的PropsData直接取替掉选项中旧的PropsData
  }
  // ...
}
```

一开始看到这里代码时，我是懵逼状态的，因为很容易绕不出来 😂。。在这里面会有几个问题，分别是：

> `validateProp`的作用究竟是什么？

相信用过`Props`的同学都清楚，在传递给子组件时，子组件中是有权限决定传递的值类型的，大大提高传递的规范，举个例子：

```js
props: {
  name: {
    type: String,
    required: true
  }
}
```

代码很好理解，就是规定`name`属性的类型以及是否必传。而方法`validateProp`作用就是校验父组件传递给子组件的值是否按要求传递，若正确传递则直接赋值给`_props`对象上相应的属性

> 校验通过后，直接赋值给`_props`对象上相应的属性的用意何在？

上面提到过，`_props`对象上的每一个属性都会使用`proxy`方法进行响应式挂载。那么当我直接赋值到`_props`对象上相应的属性时，就会触发到其`setter`函数进行相应的依赖更新。因此，当父组件更新一个传递到子组件的属性时，首先会触发其`setter`函数通知父组件进行更新，然后通过渲染函数传递到子组件后，更新子组件中的`Props`。这时候，由于此时的`Props`对象中的属性收集到了子组件的依赖，更改后会通知相应的依赖进行更新

> `toggleObserving`究竟是干嘛用的？

首先它是一个递归遍历方法，`Props`**在通知子组件依赖更新时，必须搞清楚的一点，是以整个值的变化来进行通知的**。如何理解？

简单滴说，对于属性值为基本数据类型的，当值改变时，是可以直接通知子组件进行更新的，而对于复杂数据类型来说，在更新时，会递归遍历其对象内部的属性来通知相应的依赖进行更新

那么当调用方法`toggleObserving`为`false`时，对于基础数据类型来说，当其值变化时则直接通知子组件更新，**而对于其复杂数据类型来说，则不会递归下去，而只会监听整个复杂数据类型替换时，才会去通知子组件进行更新**。因此在`Props`中所有属性通知完后，又会重新调用方法`toggleObserving`为`true`来打开递归开关

至此，你大概也知道整个更新流程了，但是我当时还是存在疑惑的，既然基础数据类型值更改或复杂数据类型整个值更改，可以直接通知到子组件进行更新，那么是否会有一种情况就是，复杂数据类型中属性更改时，又是如何通知子组件更新的呢？？🤔

首先，我们一开始已经忽略一个方法，那就是`defineReactive`，这个方法真的用得妙，可以看看上面的代码，在初始化`Props`时候，会对`Props`每一项的属性调用该方法进行响应式的处理，包括了复杂数据类型的中属性，此时该属性不但收集了父组件依赖，还收集了子组件的依赖，这样一来，当复杂数据类型中属性变化时，会先通知父组件更新，再通知子组件进行更新

## 总结

- 当`Props`中属性为基础数据类型值更改或复杂数据类型替换时，会通过`setter`函数通知父组件进行更新，然后通过渲染函数，传递到子组件中更新其`Props`对象中相应的值，这时候就会触发到相应值的`setter`来通知子组件进行更新
- 当`Props`中属性为复杂数据类型的属性更改时，由于使用`defineReactive`方法收集到了父组件依赖以及子组件的依赖，这时候会先通知父组件进行更新，再通知子组件进行更新
