::: details 基础模板
<<< @/demo/拖拽API/basic.html
:::

<iframe height="400" style="width: 100%;" scrolling="no" title="拖拽API" src="https://codepen.io/welives/embed/mdaNzzb?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/welives/pen/mdaNzzb">
  拖拽API</a> by Jandan (<a href="https://codepen.io/welives">@welives</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 课程表实战

拖拽API 本身并不复杂，难的是结合到具体的应用场景时涉及很多的知识点，考验的是对各种知识点的掌控能力

[MDN上的详细文档](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)

### 给元素加上拖拽标识

- 给科目元素加上一个`draggable`属性，用来表示该元素可以被拖拽，例如

```html
<div draggable="true" class="subject english">英语</div>
```

### 添加事件

- 由于可以被拖拽的元素可能有多个，为了更好的监控这些元素的事件，使用事件委托的方式来实现。找到它们的父元素，例如

```js
const container = document.querySelector('.container')
```

- 给父元素添加`dragstart`事件，用来监控拖拽开始，例如

```js
// e.target 表示被拖拽的元素
container.addEventListener('dragstart', function (e) {})
```

- 添加`dragover`事件，用来监控拖拽过程，类似`mouseover` 例如

```js
// e.target 表示拖拽过程中触碰到的目标元素
container.addEventListener('dragover', function (e) {})
```

- 添加`dragenter`事件，用来监控被拖拽元素进入到哪个元素内，类似`mouseenter`，例如

```js
// e.target 表示拖拽过程中进入了哪个目标元素
// 和dragover的e.target是同一个元素,但区别是每次进入一个元素只会触发一次
container.addEventListener('dragenter', function (e) {})
```

- 添加`drop`事件，用来监控拖拽释放时落在了哪个元素上，例如

::: tip
但实际操作时发现释放了之后没有触发事件，这是因为浏览器规定了某些 HTML 元素默认是不允许别的元素拖拽到它上面的，需要在`dragover`事件中阻止这些默认行为
:::

```js
container.addEventListener('drop', function (e) {})
```

### 指定拖拽类型

- 给科目元素增加一个自定义属性`data-effect`，用来表示被拖拽的元素是`copy`还是`move`，例如

```html
<div data-effect="copy" draggable="true" class="subject english">英语</div>
```

- 在拖拽开始时，获取该元素的`data-effect`属性并赋值给`e.dataTransfer.effectAllowed`，例如

```js
container.addEventListener('dragstart', function (e) {
  e.dataTransfer.effectAllowed = e.target.dataset.effect
})
```

### `dragenter`的高亮提示

- 定义一个 CSS 属性用来表示高亮，例如

```css
.drag-highlight {
  background: #c4dff6;
}
```

- 在`dragenter`事件中给`e.target`的元素添加`drag-highlight`类，例如

```js
container.addEventListener('dragenter', function (e) {
  e.target.classList.add('drag-highlight')
})
```

但此时出现了一个问题，父元素的背景色被改变了。这是因为`dragenter`事件是先进入了父元素再进入子元素的

要修复这个问题可以通过自定义属性规定哪些元素可以接受拖拽元素的，例如这里指定表格的`td`可以接受的拖拽类型是`copy`

```html
<td data-drop="copy"></td>
```

- 规定科目容器只能接受`move`类型的拖拽元素，例如

```html
<div class="left" data-drop="move"></div>
```

- 定义一个方法用来找到带有`data-drop`属性的节点，例如

```js
function getDropNode(node) {
  while (node) {
    if (node.dataset?.drop) return node
    node = node.parentNode
  }
}
```

- 定义一个方法用来清除高亮样式

```js
function clearDropStyle() {
  document.querySelectorAll('.drag-highlight').forEach((node) => {
    node.classList.remove('drag-highlight')
  })
}
```

- 在`dragenter`事件中判断拖拽元素类型和接受类型是否一致

```js{5-6}
container.addEventListener('dragenter', function (e) {
  // 先清除一遍高亮样式
  clearDropStyle()
  // 只有携带 data-drop 属性的节点才有高亮提示
  const dropNode = getDropNode(e.target)
  if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
    e.target.classList.add('drag-highlight')
  }
})
```

### `drop`事件逻辑

`drop`事件的处理分两种情况，一种从科目容器拖拽到课程表中的`copy`类型元素，另一种是从课程表中拖拽的`move`类型元素

先讲`copy`类型的情况。

- 由于`drop`事件无法拿到被拖拽元素的节点，所以需要在`dragstart`事件中将被拖拽元素的节点保存一份

```js
let source // [!code ++]
container.addEventListener('dragstart', function (e) {
  source = e.target // [!code ++]
  // ...
})
```

- 接着开始编写`drop`事件逻辑，老样子先判断拖拽元素类型和接受类型是否一致

```js{7-12}
container.addEventListener('drop', function (e) {
  // 先清除一遍高亮样式
  clearDropStyle()
  const dropNode = getDropNode(e.target)
  if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
    // 复制的情况
    if (dropNode.dataset.drop === 'copy') {
      dropNode.innerHTML = '' // 清除掉之前的节点,防止重复
      const cloned = source.cloneNode(true)
      cloned.dataset.effect = 'move' // 将塞入的拖拽元素的类型改为move
      dropNode.appendChild(cloned)
    }
  }
})
```

- `move`类型的情况就简单了，只需要将被拖拽的节点移除即可

```js
container.addEventListener('drop', function (e) {
  // ...
  if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
    if (dropNode.dataset.drop === 'copy') {
      // ...
    } else {
      // 移动的情况
      source.remove() // [!code ++]
    }
  }
})
```

到这里，整个简易的拖拽课程表就完成了
