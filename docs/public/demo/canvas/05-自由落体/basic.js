;(function () {
  /**
   * 创建动画
   * @param {CanvasRenderingContext2D} ctx
   * @param {array} balls 小球实例的数组集合
   */
  function createAnim(ctx, balls) {
    /**
     * 绘制小球
     * @param {number} time 动画进行的时间,毫秒值
     */
    return function (time) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      let isAllDone = true
      balls.forEach((ball) => {
        ball.fall(time / 1000, ctx)
        ctx.drawImage(
          ball.img,
          ball.x,
          ball.y - RADIUS * 2,
          RADIUS * 2,
          RADIUS * 2,
        )
        // 判断球是否停下来的标准是贴紧地面并且速度为0
        if (ball.y !== ctx.canvas.height || ball.v > 0) {
          isAllDone = false
        }
      })
      if (isAllDone) return false // 所有球停下来了就终止动画
      requestAnimationFrame(createAnim(ctx, balls))
    }
  }

  /**
   * 渲染canvas
   * @param {string} id
   */
  function render(id) {
    id = id.replace('#', '')
    /** @type {HTMLCanvasElement} */
    const cvs = document.querySelector(`#${id}`)
    if (cvs === null || !cvs.getContext) {
      return false
    }
    const ctx = cvs.getContext('2d')
    init(cvs)
    Promise.all(loadImagePromise(balls)).then((balls) => {
      requestAnimationFrame(createAnim(ctx, balls))
    })
  }
  render('#basic')
})()
