document.documentElement.style.fontSize =
  (document.documentElement.clientWidth / 100) * 0.125 + 'px'

const goods = [
  {
    pic: './assets/g1.png',
    title: '椰云拿铁',
    desc: `1人份【年度重磅，一口吞云】

    √原创椰云topping，绵密轻盈到飞起！
    原创瑞幸椰云™工艺，使用椰浆代替常规奶盖
    打造丰盈、绵密，如云朵般细腻奶沫体验
    椰香清甜饱满，一口滑入口腔

    【饮用建议】请注意不要用吸管，不要搅拌哦~`,
    sellNumber: 200,
    favorRate: 95,
    price: 32,
  },
  {
    pic: './assets/g2.png',
    title: '生椰拿铁',
    desc: `1人份【YYDS，无限回购】
    现萃香醇Espresso，遇见优质冷榨生椰浆，椰香浓郁，香甜清爽，带给你不一样的拿铁体验！

    主要原料：浓缩咖啡、冷冻椰浆、原味调味糖浆
    图片及包装仅供参考，请以实物为准。建议送达后尽快饮用。到店饮用口感更佳。`,
    sellNumber: 1000,
    favorRate: 100,
    price: 19.9,
  },
  {
    pic: './assets/g3.png',
    title: '加浓 美式',
    desc: `1人份【清醒加倍，比标美多一份Espresso】
    口感更佳香醇浓郁，回味持久
    图片仅供参考，请以实物为准。建议送达后尽快饮用。`,
    sellNumber: 200,
    favorRate: 93,
    price: 20.3,
  },
  {
    pic: './assets/g4.png',
    title: '瓦尔登蓝钻瑞纳冰',
    desc: `1人份【爆款回归！蓝色治愈力量】
    灵感来自下澄明、碧蓝之境---瓦尔登湖。含藻蓝蛋白，梦幻蓝色源自天然植物成分，非人工合成色素，融入人气冷榨生椰浆，椰香浓郁，清冽冰爽；底部添加Q弹小料，0脂原味晶球，光泽剔透，如钻石般blingbling。搭配奶油顶和彩虹色棉花糖，满足你的少女心～
    【去奶油小提示】由于去掉奶油后顶料口味会受影响，为保证口感，选择“去奶油”选项时将同时去掉奶油及顶料，请注意哦！【温馨提示】瑞纳冰系列产品形态为冰沙，无法进行少冰、去冰操作，请您谅解。【图片仅供参考，请以实物为准】`,
    sellNumber: 17,
    favorRate: 80,
    price: 38,
  },
  {
    pic: './assets/g5.png',
    title: '椰云精萃美式',
    desc: `1人份【不用吸管 大口吞云！】

    1杯热量*≈0.6个苹果！
    原创瑞幸椰云™工艺，将「椰浆」变成绵密、丰盈的“云朵”，口感绵密顺滑！0乳糖植物基，清爽轻负担！

    *数据引自《中国食物成分表》第六版，苹果每100克可食部分中能量约为53千卡，以每个苹果250克/个计，1杯椰云精萃美式约80千卡，相当于约0.6个苹果。
    【图片仅供参考，请以实物为准】`,
    sellNumber: 50,
    favorRate: 90,
    price: 21.12,
  },
]

// 单件商品的数据
class UIGoods {
  constructor(g) {
    this.data = g
    this.choose = 0
  }
  // 获取商品总价
  getTotalPrice() {
    return this.data.price * this.choose
  }
  // 是否选中了商品
  isChoose() {
    return this.choose > 0
  }
  // 选中商品数量+1
  increase() {
    this.choose++
  }
  // 选中商品数量-1
  decrease() {
    if (this.choose === 0) {
      return
    }
    this.choose--
  }
}

// 整个界面的数据
class UIData {
  constructor() {
    this.uiGoods = goods.map((g) => new UIGoods(g))
    this.deliveryPrice = 5
    this.deliveryThreshold = 30
  }
  // 获取购物车总价
  getTotalPrice() {
    return this.uiGoods.reduce((total, cur) => {
      return total + cur.getTotalPrice()
    }, 0)
  }
  // 购物车商品数量增加
  increase(index) {
    this.uiGoods[index].increase()
  }
  // 购物车商品数量减少
  decrease(index) {
    this.uiGoods[index].decrease()
  }
  // 购物车中的商品总数
  getTotalChooseCount() {
    return this.uiGoods.reduce((total, cur) => {
      return total + cur.choose
    }, 0)
  }
  // 购物车中是否有商品
  hasGoodsInCar() {
    return this.getTotalChooseCount() > 0
  }
  // 是否达到起送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }
  isChoose(index) {
    return this.uiGoods[index].isChoose()
  }
}

// 整个界面
class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge'),
      fontSize: parseFloat(document.documentElement.style.fontSize),
    }
    // 获取购物车图标的布局信息
    const carRect = this.doms.car.getBoundingClientRect()
    this.jumpTarget = {
      x: carRect.x + carRect.width / 2 + 100 * this.doms.fontSize,
      y: carRect.y + carRect.height / 5 + 100 * this.doms.fontSize,
    }
    this.createGoodsListHTML()
    // 监听动画结束事件
    this.doms.car.addEventListener('animationend', (e) => {
      e.target.classList.remove('animate')
    })
  }
  // 动态创建商品列表项
  createGoodsListHTML() {
    let html = ''
    this.uiData.uiGoods.forEach((el, idx) => {
      html += `<div class="goods-item">
      <img src="${el.data.pic}" alt="${el.data.title}" class="goods-pic" />
      <div class="goods-info">
        <h2 class="goods-title">${el.data.title}</h2>
        <p class="goods-desc">${el.data.desc}</p>
        <p class="goods-sell">
          <span>月售 ${el.data.sellNumber}</span>
          <span>好评率${el.data.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${el.data.price}</span>
          </p>
          <div class="goods-btns">
            <i data-index="${idx}" class="iconfont i-jianhao"></i>
            <span>${el.choose}</span>
            <i data-index="${idx}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`
    })
    this.doms.goodsContainer.innerHTML = html
  }
  increase(index) {
    this.uiData.increase(index)
    this.updateGoodsItem(index)
    this.jump(index)
  }
  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index)
  }
  // 更新某个商品元素的显示状态
  updateGoodsItem(index) {
    const goodsDom = this.doms.goodsContainer.children[index]
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add('active')
    } else {
      goodsDom.classList.remove('active')
    }
    const numDom = goodsDom.querySelector('.goods-btns span')
    numDom.textContent = this.uiData.uiGoods[index].choose
    this.updateFooter()
  }
  // 更新页脚统计数据
  updateFooter() {
    const total = this.uiData.getTotalPrice()
    // 设置购物车总价
    this.doms.totalPrice.textContent = total.toFixed(2)
    // 设置购物车中的数量
    this.doms.badge.textContent = this.uiData.getTotalChooseCount()
    // 设置起送费
    if (this.uiData.isCrossDeliveryThreshold()) {
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      const dis = Math.round(this.uiData.deliveryThreshold - total)
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`
    }
    // 设置购物车的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
      this.doms.car.classList.add('active')
    } else {
      this.doms.deliveryPrice.textContent = `配送费￥0`
      this.doms.car.classList.remove('active')
    }
  }
  // 抛物线元素
  jump(index) {
    const btnAdd = this.doms.goodsContainer.children[index].querySelector(
      '.i-jiajianzujianjiahao',
    )
    const rect = btnAdd.getBoundingClientRect()
    const start = {
      x: rect.x + rect.width / 2 + 100 * this.doms.fontSize,
      y: rect.y + rect.height / 2 + 100 * this.doms.fontSize,
    }
    const div = document.createElement('div')
    const i = document.createElement('i')
    div.className = 'add-to-car'
    i.className = 'iconfont i-jiajianzujianjiahao'
    /**
     * 设置起始位置
     * 给父元素设置水平方向的速度,通过父元素带动子元素获得水平方向的速度
     * 给子元素设置一个垂直方向的速度,只有这样才能模拟抛物线效果
     */
    div.style.transform = `translateX(${start.x}px)`
    i.style.transform = `translateY(${start.y}px)`
    div.appendChild(i)
    document.body.appendChild(div)

    // 监听过度动画结束事件
    div.addEventListener(
      'transitionend',
      (e) => {
        this.doms.car.classList.add('animate')
        e.target.remove() // 动画结束后删除自己
      },
      {
        once: true, // 表示事件仅触发一次
      },
    )

    // 执行一个动画,避免reflow
    requestAnimationFrame(() => {
      // 结束位置
      div.style.transform = `translateX(${this.jumpTarget.x}px)`
      i.style.transform = `translateY(${this.jumpTarget.y}px)`
    })
  }
}

const ui = new UI()

// 事件
ui.doms.goodsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    const index = e.target.dataset.index
    ui.increase(index)
  } else if (e.target.classList.contains('i-jianhao')) {
    const index = e.target.dataset.index
    ui.decrease(index)
  }
})
