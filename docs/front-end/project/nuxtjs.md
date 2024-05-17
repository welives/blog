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

## 页面和布局

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
  <div :class="cn('debug-screens')">
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
  <div :class="cn('debug-screens')">
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

- 方式二：在页面中先通过`definePageMeta`方法禁用布局(`layout: false`)，然后再使用`<NuxtLayout>`组件来完全控制布局

::: warning 💥注意
一定要记得先用`definePageMeta`方法禁用布局，否则就会变成嵌套布局了
:::

::: code-group

```vue [app.vue]
<template>
  <div :class="cn('debug-screens')">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

```vue{2-4,9-17} [页面]
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <NuxtLayout name="home">
      <template #header>
        <div>header</div>
      </template>
      <div class="text-red-500">index page</div>
      <template #footer>
        <div>footer</div>
      </template>
    </NuxtLayout>
  </div>
</template>
```

```vue [home布局]
<template>
  <main class="px-4 w-full bg-green-300">
    <header>
      <slot name="header" />
    </header>
    <slot />
    [Home Layout]
    <slot name="footer" />
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
  <div :class="cn('debug-screens')">
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
