
  // 获取整个方块
  const div = document.querySelector('.re')
  // 获取分数
  const co = document.querySelector('.color')
  // 获取失败模块
  const shib = document.querySelector('.shi')
  // 获取重新开始按钮
  const button = document.getElementsByTagName('button')
// 获取方块宽度
  const blockWin = document.querySelector("tbody > tr:nth-child(1) > td:nth-child(1)").offsetWidth
  //  控制键盘频率 定时器id
  let dishi
  // 控制键盘频率
  let frequency = true
  // 总分
  let grade = 0
  let sx, sy
  let aaa
  // 生成创建模块函数
  function create() {
    // 获取所有非含有方块
    let td = document.querySelectorAll('td:not([d_td])')
    if (td.length < 1) return
    // 随机获取空的方块的坐标
    let rand = parseInt(Math.random() * (td.length))
    let x = td[rand].offsetLeft
    let y = td[rand].offsetTop
    // 创建数字块并初始化值为2
    let x_p = document.createElement('p')
    x_p.style.left = x + 'px'
    x_p.style.top = y + 'px'
    x_p.innerText = 2
    x_p.setAttribute('left', x)
    x_p.setAttribute('top', y)
    // 给对应的位置标记属性
    td[rand].setAttribute('d_td', '2')
    return div.appendChild(x_p)
  }
  create()
  create()
  // 设置重新开始
  button[0].addEventListener('click', function () {
    shib.style.display = 'none'

    grade = 0
    co.innerText = grade
    div.innerHTML = ` <table>
      <tr>
        <td ></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>`
    frequency = true
    create()
    create()
  })
  // 添加键盘事件
  window.onkeyup = (e) => {
    let wsad = ["a", "s", "w", "d"]
    if (!wsad.includes(e.key)) return
    // 设置节流阀
    if (!frequency) return
    dishi = setTimeout(function () {
      frequency = true
      if (playEnd()) return create()

      shib.style.display = 'block'

      clearTimeout(dishi)
      frequency = false

    }, 300)
    move(e.key)
  }
  // 手指滑动事件
  window.ontouchstart = (e) => {
    sx = e.touches[0].clientX
    sy = e.touches[0].clientY
  }
  window.ontouchend = (e) => {
    if (Math.abs(e.changedTouches[0].clientX - sx) == Math.abs(e.changedTouches[0].clientY - sy)) return
    if (!frequency) return
    dishi = setTimeout(function () {
      frequency = true
      if (playEnd()) return create()
      shib.style.display = 'block'
      clearTimeout(dishi)
      frequency = false
    }, 300)
      const tou = e.changedTouches[0]
      // 判断滑动方向
      if (Math.abs(tou.clientX - sx) > Math.abs(tou.clientY - sy) && tou.clientX - sx > 0) {
        move('d')
      } else if (Math.abs(tou.clientX - sx) > Math.abs(tou.clientY - sy) && tou.clientX - sx < 0) {
        move('a')
      } else if (Math.abs(tou.clientX - sx) < Math.abs(tou.clientY - sy) && tou.clientY - sy > 0) {
        move('s')
      } else {
        move('w')
      }
    
  }
  // 创建方块移动函数
  function move(direction) {
    frequency = false
    let calls = {
      a: ["offsetTop", "offsetLeft", -1],
      s: ["offsetLeft", "offsetTop", 1],
      d: ["offsetTop", "offsetLeft",1],
      w: ["offsetLeft", "offsetTop", -1]
    }
    let [type, compare, signed] = calls[direction]
    // 获取在场的所有方块并转换为升序数组
    let p = [...document.querySelectorAll('p')].sort((a, b) => (a[compare] - b[compare]) * signed*-1)
    // 遍历所有元素
    p.forEach((value) => {
      let i = 0,
        gu = true,
        bei = null
      let td = [...document.querySelectorAll('td[d_td]')] // 获取含有d_td属性的td
      while (gu) {
        // 判断要移动的位置是否有元素或超出范围
        gu = !(
          directions(direction, value[compare] + (i + 1) * blockWin * signed ) ||
          td.some((_td) => {
            let tu = _td[type] === value[type] && _td[compare] === value[compare] + (i + 1) * blockWin * signed 
            if (tu) {
              bei = _td
            }
            return tu
          })
        )
        i += gu     // 若没有则 i 加一 好判断下一个位置
        // 若有则给对应的方块添加标识
        if (bei && value.innerText === bei.getAttribute('d_td')) {
          //添加标识
          identification(bei)
          value.innerText = value.innerText * 2
          // 设置对应的分数
          grade += value.innerText * 1
          co.innerHTML = grade
          i++   // 并使方块额外前进一格
        }
      }
      // 让方块移动
      value.style[compare.slice(6).toLowerCase()] = value[compare] + i * blockWin * signed  + 'px'
      value.setAttribute(compare.slice(6).toLowerCase(), value[compare] + i * blockWin * signed )
      value.setAttribute(type.slice(6).toLowerCase(), value[type])
        // 移除之前的标识
        ;[...document.querySelectorAll('td')].some((ad) => {
          if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop) {
            ad.removeAttribute('d_td')
            return true
          }
        })
        // 添加标识
        ;[...document.querySelectorAll('td')].some((ad) => {
          if (ad[compare] === value[compare] + (i * blockWin) * signed  && ad[type] === value[type]) {
            ad.setAttribute('d_td', value.innerText)
            return true
          }
        })
    })
    removch('p[san]')// 删除标识方块
  }
  //操作提示
  const tishi = document.getElementsByClassName('tishi')
  if (document.body.offsetWidth < 1000) {
    tishi[0].innerText = '通过手指滑动进行操作'
  }
  function removch(tag) {
    setTimeout(() => {
      [...document.querySelectorAll(tag)].forEach((element) => {
        div.removeChild(element)
      })
    }, 300)

  }
  //添加标识
  function identification({ offsetTop, offsetLeft }) {
    [...document.querySelectorAll('p')]
      .filter((val) => val.getAttribute('top') == offsetTop && val.getAttribute('left') == offsetLeft)
      .forEach((value) => {
        value.setAttribute('san', 0)
      })
  }
  // 判断游戏是否结束
  function playEnd() {
    // 框内是否有空位
    let td = [...document.querySelectorAll('td')]
    let hotd = td.filter(elem => !elem.hasAttribute("d_td"))
    if (hotd.length > 0) return true
    // 上下左右是否有值相同
    return td.some((elem, index) => {
      let val = elem.getAttribute("d_td")
      let lval = td?.[index - 1]?.getAttribute("d_td") || 1
      let rval = td?.[index + 1]?.getAttribute("d_td") || 1
      let dval = td?.[index + 4]?.getAttribute("d_td") || 1
      let tval = td?.[index - 4]?.getAttribute("d_td") || 1
      return val == lval || val == rval || val == dval || val == tval
    })
  }
  // 根据方向返回是否符合条件
  function directions(direction, val) {
    switch (direction) {
      case "a":
        return val < 0;
      case "s":
        return val > 153;
      case "w":
        return val < 0;
      case "d":
        return val > 154;
    }
  }