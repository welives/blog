/**
 * 获取歌词文本
 * @param {string} url
 * @returns
 */
function getLyric(url) {
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'text'
  xhr.open('GET', url, true)
  xhr.send()
  return new Promise((resolve, reject) => {
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject('请求失败')
      }
    }
  })
}

/**
 * 解析歌词字符串
 * @param {string} str
 * @returns {array} 返回一个歌词对象的数组
 */
function parseLyricStr(str) {
  const lines = str.split('\r\n')
  return lines.reduce((prev, cur) => {
    const lyricTime = cur.match(/(?<=\[)(\d{2}):(\d{2}\.\d+)(?=\])/)
    const lyricContent = cur.replace(/\[(\d{2}):(\d{2}\.\d+)\]/, '').trim()
    return [
      ...prev,
      { time: +lyricTime[1] * 60 + +lyricTime[2], content: lyricContent },
    ]
  }, [])
}

/**
 * 创建歌词元素li
 * @param {array} lyricArr 歌词对象数组
 * @param {Element} dom 歌词列表的ul节点
 */
function createLyricElements(lyricArr, dom) {
  const frag = document.createDocumentFragment()
  lyricArr.forEach((el) => {
    const li = document.createElement('li')
    li.setAttribute('data-time', el.time)
    li.textContent = el.content
    frag.appendChild(li)
  })
  dom.appendChild(frag)
}

/**
 * 计算出当前播放器的高亮歌词下标
 * @param {array} lyricArr 歌词对象数组
 * @param {number} curTime 当前播放时间
 */
function findHighLightIndex(lyricArr, curTime) {
  for (let i = 0; i < lyricArr.length; i++) {
    if (curTime < lyricArr[i].time) {
      return i - 1
    }
  }
  // 播放到末尾时的情况
  return lyricArr.length - 1
}

;(async function () {
  const lyricStr = await getLyric('./This Christmas - TONICK.lrc')
  const doms = {
    audio: document.querySelector('audio'),
    container: document.querySelector('.container'),
    ul: document.querySelector('.container ul'),
  }
  const lyricData = parseLyricStr(lyricStr)
  createLyricElements(lyricData, doms.ul)
  const containerHeight = doms.container.clientHeight
  const liHeight = doms.ul.children[0].clientHeight
  const maxOffset = doms.ul.clientHeight - containerHeight

  doms.audio.addEventListener('timeupdate', (e) => {
    const index = findHighLightIndex(lyricData, e.target.currentTime)
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2
    if (offset < 0) {
      offset = 0
    }
    if (offset > maxOffset) {
      offset = maxOffset
    }
    // 去掉之前的active样式
    let li = doms.ul.querySelector('.active')
    if (li) {
      li.classList.remove('active')
    }
    // 加上新的active样式
    li = doms.ul.children[index]
    if (li) {
      li.classList.add('active')
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
  })
})()
