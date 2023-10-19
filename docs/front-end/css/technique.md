---
title: CSS奇技淫巧
---

## 空白折叠

所谓「**空白折叠**」其实是 HTML 代码在编辑器中回车换行后产生的，因为在浏览器渲染时，多个空白符会被合并成一个空格字符进行渲染。空白折叠只会出现在行盒与行块盒排列中

<iframe height="300" style="width: 100%;" scrolling="no" title="空白折叠问题" src="https://codepen.io/welives/embed/zYyBEJz?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/zYyBEJz">
  空白折叠问题</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 阴影

`box-shadow`无法覆盖伪元素的小三角，但是`filter`的`drop-shadow`可以

<iframe height="300" style="width: 100%;" scrolling="no" title="阴影" src="https://codepen.io/welives/embed/wvRWNLw?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/wvRWNLw">
  阴影</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 文字排列方向

<iframe height="300" style="width: 100%;" scrolling="no" title="诗歌排列" src="https://codepen.io/welives/embed/poqbYgN?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/poqbYgN">
  诗歌排列</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 高度自动的过渡效果

<iframe height="450" style="width: 100%;" scrolling="no" title="高度自动的过渡效果" src="https://codepen.io/welives/embed/gOZVvPJ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/gOZVvPJ">
  高度自动的过渡效果</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
