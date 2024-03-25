---
title: BEM命名法
head:
  - - meta
    - name: description
      content: BEM命名法
  - - meta
    - name: keywords
      content: bem css 命名规范
---

## 概念

`BEM命名法`，是对 CSS 命名的一种规范，将页面模块化，隔离样式，提高代码的复用性，减少后期的维护成本。BEM 的意思就是`Block(块)`、`Element(元素)`、`modifier(修饰符)`，利用不同的块，功能以及样式来给元素命名，通过双下划线`__`或者双中划`--`链接。

BEM 通常用于框架开发中，比如微信`WEUI`、饿了么`Element-ui`、有赞`Vant`等

```css
.block {
}
.block__element {
}
.block--modifier {
}
```

::: tip

- `block`代表更高级别的抽象或组件
- `block__element`代表`block`的后代，用于形成一个完整的`block`的整体
- `block--modifier`代表`block`的不同状态或不同版本

:::

## 常用规范

- `block`、`element`、`modifier`包含多个单词时，用一个中划线`-`链接,例如`el-dropdown-menuel-button`
- `block`和`element`用双下划线`__`链接，例如`form__item`、`menu__item`
- `element`和`modifier`用双中划线`--`链接，一般用来表示元素的不同状态，例如`el-button--default`、`el-button--success`
- 用 JS 控制样式时，CSS 命名用`is-`开头，例如`is-success`、`is-failed`、`is-disabled`
