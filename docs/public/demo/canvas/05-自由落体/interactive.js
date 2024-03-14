;(function () {
  const utils = {
    mouseInited: false, // 判断是否已经初始化
    mouse: {
      x: null,
      y: null,
      isPressed: false,
    },
    /**
     * 获取鼠标在画布内的坐标,以左上角为(0,0)
     * @param {HTMLCanvasElement} ele 画布DOM
     * @returns {{x:number,y:number,isPressed:boolean}}
     */
    captureMouse: function (ele) {
      // 单例模式
      if (this.mouseInited) return this.mouse
      ele.addEventListener('mousedown', () => {
        this.mouse.isPressed = true
      })
      ele.addEventListener('mouseup', () => {
        this.mouse.isPressed = false
      })
      ele.addEventListener('mousemove', (event) => {
        const coor = isMouseInTarget(event, event.target)
        this.mouse.x = coor.x
        this.mouse.y = coor.y
      })
      this.mouseInited = true
      return this.mouse
    },
    touchInited: false, // 判断是否已经初始化
    touch: {
      x: null,
      y: null,
      isPressed: false,
    },
    /**
     * 获取触点在画布内的坐标,以左上角为(0,0)
     * @param {HTMLCanvasElement} ele 画布DOM
     * @returns {{x:number,y:number,isPressed:boolean}}
     */
    captureTouch: function (ele) {
      // 单例模式
      if (this.touchInited) return this.touch
      ele.addEventListener('touchstart', () => {
        this.touch.isPressed = true
      })
      ele.addEventListener('touchend', () => {
        this.touch.x = null
        this.touch.y = null
        this.touch.isPressed = false
      })
      ele.addEventListener('touchmove', (event) => {
        // 只考虑单点触控,因此取数组第一个元素
        const coor = isMouseInTarget(event.touches[0], event.target)
        this.touch.x = coor.x
        this.touch.y = coor.y
      })
      this.touchInited = true
      return this.touch
    },
  }

  /**
   * 判断鼠标是否在目标元素的坐标范围内
   * @param {MouseEvent} mouse 鼠标事件
   * @param {HTMLCanvasElement} element 目标元素
   * @returns {{x:number,y:number}} 返回鼠标在目标元素中的坐标系,以左上角为(0,0)
   */
  function isMouseInTarget(mouse, element) {
    // 整个文档的坐标
    let x, y
    if (mouse.pageX || mouse.pageY) {
      x = mouse.pageX
      y = mouse.pageY
    } else {
      // 兼容IE
      x =
        mouse.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft
      y =
        mouse.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop
    }
    return {
      x: x - element.offsetLeft,
      y: y - element.offsetTop,
    }
  }
  /**
   * 判断鼠标点到哪个球上
   * @param {{x:number,y:number,isPressed:boolean}} coor 鼠标在画布中的坐标
   * @param {array} balls 小球实例集合
   * @return {object|boolean}
   */
  function whichBallClicked(coor, balls) {
    const mouseX = coor.x
    const mouseY = coor.y
    let ball = false
    // 遍历所有球
    balls.forEach((el) => {
      // 获取球的圆心坐标
      const x = el.x + RADIUS
      // const y = el.isControl ? el.y + RADIUS : el.y - RADIUS // TODO
      const y = el.y - RADIUS
      // 勾股定理求点击位置到圆心的距离
      const distance = Math.sqrt(
        Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2),
      )
      if (distance <= RADIUS) ball = el
    })

    return ball
  }
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
      balls.forEach((ball) => {
        ball.fall(time / 1000, ctx)
        ctx.drawImage(
          ball.img,
          ball.x,
          ball.y - RADIUS * 2, // 因为是从图片的左上角开始绘制,所以需要减去球的直径
          RADIUS * 2,
          RADIUS * 2,
        )
      })
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
    // 初始化画布的坐标系
    const mouse = utils.captureMouse(cvs)
    Promise.all(loadImagePromise(balls)).then((balls) => {
      requestAnimationFrame(createAnim(ctx, balls)) // 启动动画
      // 鼠标按下时
      cvs.addEventListener('mousedown', function () {
        const clickedBall = whichBallClicked(mouse, balls)
        if (clickedBall === false) return
        clickedBall.control(mouse, cvs)
      })
    })
  }
  render('#interactive')
})()
