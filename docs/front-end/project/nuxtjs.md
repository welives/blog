---
title: Nuxt3项目笔记
head:
  - - meta
    - name: description
      content: Nuxt3项目笔记
  - - meta
    - name: keywords
      content: vue nuxt.js nuxt3
---

## 布局

`pages`目录下的页面内容会挂载到`<NuxtPage />`组件上，并渲染到布局文件的插槽(`<slot />`)

`<NuxtPage />`组件相当于`Vue-Router`的`<RouterView />`

::: code-group

```vue [index.vue]
<template>
  <div class="text-red-500">index page</div>
</template>
```

```vue [app.vue]
<template>
  <div>
    app.vue
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

```vue [默认布局]
<template>
  <main class="px-4 w-full bg-slate-300">
    <slot />
    [Default Layout]
  </main>
</template>
```

:::

![](./assets/页面和布局_1.png)

### 切换布局的方式

- 方式一：在页面中使用`setPageLayout`方法进行切换

::: code-group

```vue [app.vue]
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

```vue{2-4} [页面]
<script setup lang="ts">
function switchLayout() {
  setPageLayout('home')
}
</script>

<template>
  <div class="text-red-500">
    index page
    <div><button @click="switchLayout">Switch Home Layout</button></div>
  </div>
</template>
```

:::

- 方式二：在页面中通过`definePageMeta`方法切换布局

::: code-group

```vue [app.vue]
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

```vue{2-4,9-17} [页面]
<script setup lang="ts">
definePageMeta({
  layout: 'home'
})
</script>

<template>
  <div>
    <div class="text-red-500">
      index page
    </div>
  </div>
</template>

```

```vue [home布局]
<template>
  <main class="px-4 w-full bg-green-300">
    <slot />
    <div class="mx-auto mt-5 text-center text-sm opacity-25">[Custom Layout]</div>
  </main>
</template>
```

:::

### 布局最佳实践

:::: danger ✨
不要在`app.vue`中进行布局控制，而是具体到每个页面中进行控制，因为这样可以让每个页面有更好的灵活性

::: code-group

```vue [app.vue]
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

```vue [index页面]
<template>
  <div>
    <NuxtLayout>
      <template #header>
        <div>header</div>
      </template>
      <div class="text-red-500">index page</div>
      <NuxtLink to="/about"><button>Go about</button></NuxtLink>
      <template #footer>
        <div>footer</div>
      </template>
    </NuxtLayout>
  </div>
</template>
```

```vue [about页面]
<template>
  <div>
    <NuxtLayout name="home">
      <div>about page</div>
    </NuxtLayout>
  </div>
</template>
```

:::

::::

### 切换路由页面不更新

原因是`<NuxtLayout>`没有用一个普通的 HTML 标签包裹起来，比如`<div>`

::: code-group

```vue [正确的写法]
<template>
  <div>
    <NuxtLayout>
      <div>index page</div>
      <NuxtLink to="/about"><button>Go</button></NuxtLink>
    </NuxtLayout>
  </div>
</template>
```

```vue [错误的写法]
<template>
  <NuxtLayout>
    <div>index page</div>
    <NuxtLink to="/about"><button>Go</button></NuxtLink>
  </NuxtLayout>
</template>
```

:::

## 页面

Nuxt的路由基于`Vue-Router`，`pages`目录中的每个Vue文件都会创建一个相应的URL。`pages/index.vue`文件将被映射到应用程序`/`路由

### 动态路由

建立页面文件时，如果命名时将任何内容放在方括号`[]`内，它将被转换为路由参数。在文件名或目录中混合和匹配多个参数

::: code-group

```[目录结构]
├─ pages/
   └─ users-[group]/
      └─ [id].vue

```

```json [生成的路由]
{
  "routes": [
    {
      "name": "users-group-id",
      "path": "/users-:group/:id",
      "component": "pages/users-[group]/[id].vue"
    }
  ]
}
```

:::

在页面中可以通过`useRoute()`函数来获取当前路由的参数

```vue
<script setup lang="ts">
const route = useRoute()
const { id, group } = route.params
</script>
```

## 组件自动引入

默认情况下，Nuxt 会扫描`components`目录下的所有`vue`文件

当存在多层次目录结构时，自动引入时所生成的组件类型声明会带上目录名称，例如下面的`Button.vue`组件，最终得到的类型声明是`BaseFooButton`，在页面中使用时要这样`<BaseFooButton />
`

```
├─ components
   └─ base
      └─ foo
         └─ Button.vue
```

如果不想让类型声明带上目录名称，可以把`pathPrefix`设置为`false`

这时候`Button.vue`组件的类型声明就是`Button`了，在页面中使用时直接`<Button />`即可

```ts
export default defineNuxtConfig({
  components: [
    {
      path: '~/components',
      pathPrefix: false, // [!code ++]
    },
  ],
})
```

::: danger 💥注意
但是这样做的话就难免会出现组件同名的情况，即多个组件共用一个组件类型声明，这并不是一个好事。所以不推荐这样做
:::
