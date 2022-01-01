;(function () {
  window.addEventListener('load', function () {
    // 获取整个方块
    const div = document.getElementsByClassName('re')[0]
    // 获取分数
    const co = document.querySelector('.color')
    // 获取失败模块
    const shib = document.querySelector('.shi')
    // 获取重新开始按钮
    const button = document.getElementsByTagName('button')
    //  控制键盘频率 定时器id
    let dishi
    // 控制键盘频率
    let frequency = true
    // 总分
    let grade = 0
    //
    let sx, sy
    let aaa
    // 生成创建模块函数
    function create() {
      // 生成随机坐标
      let x = parseInt(Math.random() * parseInt(div.clientWidth / 50)) * 51
      let y = parseInt(Math.random() * parseInt(div.clientHeight / 50)) * 51
      // 获取所有含有方块
      let td = document.querySelectorAll('td[d_td]')
      let or = ![...td].some((value) => {
        return value.offsetLeft === x && value.offsetTop === y
      })
      //  判断随机坐标是否有块
      // 无创建
      if (or) {
        // 创建每次移动时的方块
        let x_p = document.createElement('p')
        x_p.style.left = x + 'px'
        x_p.style.top = y + 'px'
        x_p.innerText = 2

        x_p.setAttribute('left', x)
        x_p.setAttribute('top', y)
        // 给对应的位置标记属性
        ;[...document.querySelectorAll('td')].some((value) => {
          if (value.offsetLeft === x && value.offsetTop === y) {
            value.setAttribute('d_td', '2')
            return true
          }
        })
        div.appendChild(x_p)
      } else {
        // 有重新获取
        create()
      }
    }
    create()
    create()
    // 设置重新开始
    button[0].addEventListener('click', function () {
      shib.style.display = 'none'

      grade = 0
      co.innerHTML = grade
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
      // 设置节流阀

      if (frequency) {
        dishi = setTimeout(function () {
          frequency = true
          try {
            create()
          } catch (err) {
            shib.style.display = 'block'

            clearTimeout(dishi)
            frequency = false
          }
        }, 300)

        // 判断玩家按下的键
        switch (e.key) {
          // 左键
          case 'a':
            move('left')

            break
          // 右键
          case 'd':
            move('right')

            break
          // 上键
          case 'w':
            move('top')

            break
          // 下键
          case 's':
            move('bottom')

            break
        }
      }
    }
    // 手指滑动事件
    window.ontouchstart = (e) => {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
    }
    window.ontouchend = (e) => {
      if (Math.abs(e.changedTouches[0].clientX - sx) == Math.abs(e.changedTouches[0].clientY - sy)) return
      if (frequency) {
        dishi = setTimeout(function () {
          frequency = true
          try {
            create()
          } catch (err) {
            shib.style.display = 'block'

            clearTimeout(dishi)
            frequency = false
          }
        }, 300)
        const tou = e.changedTouches[0]
        // 判断滑动方向
        if (Math.abs(tou.clientX - sx) > Math.abs(tou.clientY - sy) && tou.clientX - sx > 0) {
          move('right')
        } else if (Math.abs(tou.clientX - sx) > Math.abs(tou.clientY - sy) && tou.clientX - sx < 0) {
          move('left')
        } else if (Math.abs(tou.clientX - sx) < Math.abs(tou.clientY - sy) && tou.clientY - sy > 0) {
          move('bottom')
        } else {
          move('top')
        }
      }
    }
    // 创建方块移动函数
    function move(direction) {
      frequency = false
      let p

      switch (direction) {
        // 左
        case 'left':
          // 获取在场的所有方块并转换为升序数组
          p = [...document.querySelectorAll('p')].sort((a, b) => a.offsetLeft - b.offsetLeft)
          // 遍历所有元素
          p.forEach((value) => {
            let i = 0,
              gu = true,
              bei = null,
              tec = false
            // 获取含有d_td属性的td
            let td = [...document.querySelectorAll('td[d_td]')]
            while (gu) {
              // 判断要移动的位置是否有元素或超出范围
              gu = !(
                value.offsetLeft - i * 51 - 51 < 0 ||
                td.some((_td) => {
                  if (_td.offsetTop === value.offsetTop && _td.offsetLeft === value.offsetLeft - i * 51 - 51) {
                    bei = _td
                  }
                  return _td.offsetTop === value.offsetTop && _td.offsetLeft === value.offsetLeft - i * 51 - 51
                })
              )
              // 若没有则 i 加一 好判断下一个位置
              if (gu) {
                i++
              }
              // 若有则给对应的方块添加标识
              if (bei && value.innerText === bei.getAttribute('d_td')) {
                ;[...document.querySelectorAll('p')]
                  .filter((val) => val.getAttribute('top') == bei.offsetTop && val.getAttribute('left') == bei.offsetLeft)
                  .forEach((value) => {
                    value.setAttribute('san', 0)
                  })
                value.innerText = value.innerText * 2
                // 设置对应的分数
                grade += value.innerText * 1
                co.innerHTML = grade
                // 并使方块额外前进一格
                i++
                tec = true
              }
            }
            // 删除标识方块
            if (tec) {
              clearTimeout(aaa)
              aaa = setTimeout(function () {
                ;[...document.querySelectorAll('p[san]')].forEach((element) => {
                  div.removeChild(element)
                })
              }, 200)
            }
            // 让方块移动
            value.style.left = value.offsetLeft - i * 51 + 'px'
            value.setAttribute('left', value.offsetLeft - i * 51)
            value.setAttribute('top', value.offsetTop)
            // 移除之前的标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop) {
                ad.removeAttribute('d_td')
                return true
              }
            })
            // 添加标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft - i * 51 && ad.offsetTop === value.offsetTop) {
                ad.setAttribute('d_td', value.innerText)
                return true
              }
            })
          })

          break
        // 右
        case 'right':
          // 获取在场的所有方块并转换为升序数组
          p = [...document.querySelectorAll('p')].sort((a, b) => b.offsetLeft - a.offsetLeft)
          // 遍历所有元素
          p.forEach((value) => {
            let i = 0,
              gu = true,
              bei = null,
              tec = false
            // 获取含有d_td属性的td
            let td = [...document.querySelectorAll('td[d_td]')]
            while (gu) {
              // 判断要移动的位置是否有元素或超出范围
              gu = !(
                value.offsetLeft + i * 51 + 51 > 154 ||
                td.some((_td) => {
                  if (_td.offsetTop === value.offsetTop && _td.offsetLeft === value.offsetLeft + i * 51 + 51) {
                    bei = _td
                  }
                  return _td.offsetTop === value.offsetTop && _td.offsetLeft === value.offsetLeft + i * 51 + 51
                })
              )
              // 若没有则 i 加一 好判断下一个位置
              if (gu) {
                i++
              }
              // 若有则给对应的方块添加标识
              if (bei && value.innerText === bei.getAttribute('d_td')) {
                ;[...document.querySelectorAll('p')]
                  .filter((val) => val.getAttribute('top') == bei.offsetTop && val.getAttribute('left') == bei.offsetLeft)
                  .forEach((value) => {
                    value.setAttribute('san', 0)
                  })
                value.innerText = value.innerText * 2
                // 并使方块额外前进一格
                i++
                tec = true
                // 设置对应的分数
                grade += value.innerText * 1
                co.innerHTML = grade
              }
            }

            value.style.left = value.offsetLeft + i * 51 + 'px'
            // 删除标识方块
            if (tec) {
              clearTimeout(aaa)
              aaa = setTimeout(function () {
                ;[...document.querySelectorAll('p[san]')].forEach((element) => {
                  div.removeChild(element)
                })
              }, 200)
            }
            // 让方块移动
            value.setAttribute('left', value.offsetLeft + i * 51)
            value.setAttribute('top', value.offsetTop)
            // 移除之前的标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop) {
                ad.removeAttribute('d_td')
                return true
              }
            })
            // 添加标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft + i * 51 && ad.offsetTop === value.offsetTop) {
                ad.setAttribute('d_td', value.innerText)
                return true
              }
            })
          })

          break
        // 上
        case 'top':
          // 获取在场的所有方块并转换为升序数组
          p = [...document.querySelectorAll('p')].sort((a, b) => a.offsetTop - b.offsetTop)
          // 遍历所有元素
          p.forEach((value) => {
            let i = 0,
              gu = true,
              bei = null,
              tec = false
            // 获取含有d_td属性的td
            let td = [...document.querySelectorAll('td[d_td]')]
            while (gu) {
              // 判断要移动的位置是否有元素或超出范围
              gu = !(
                value.offsetTop - i * 51 - 51 < 0 ||
                td.some((_td) => {
                  if (_td.offsetLeft === value.offsetLeft && _td.offsetTop === value.offsetTop - i * 51 - 51) {
                    bei = _td
                  }
                  return _td.offsetLeft === value.offsetLeft && _td.offsetTop === value.offsetTop - i * 51 - 51
                })
              )
              // 若没有则 i 加一 好判断下一个位置
              if (gu) {
                i++
              }
              // 若有则给对应的方块添加标识
              if (bei && value.innerText === bei.getAttribute('d_td')) {
                ;[...document.querySelectorAll('p')]
                  .filter((val) => val.getAttribute('top') == bei.offsetTop && val.getAttribute('left') == bei.offsetLeft)
                  .forEach((value) => {
                    value.setAttribute('san', 0)
                  })
                value.innerText = value.innerText * 2
                // 并使方块额外前进一格
                i++
                tec = true
                // 设置对应的分数
                grade += value.innerText * 1
                co.innerHTML = grade
              }
            }
            // 删除标识方块
            if (tec) {
              clearTimeout(aaa)
              aaa = setTimeout(function () {
                ;[...document.querySelectorAll('p[san]')].forEach((element) => {
                  div.removeChild(element)
                })
              }, 200)
            }
            // 让方块移动
            value.style.top = value.offsetTop - i * 51 + 'px'
            value.setAttribute('left', value.offsetLeft)
            value.setAttribute('top', value.offsetTop - i * 51)
            // 移除之前的标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop) {
                ad.removeAttribute('d_td')
                return true
              }
            })
            // 添加标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop - i * 51) {
                ad.setAttribute('d_td', value.innerText)
                return true
              }
            })
          })

          break
        // 下
        case 'bottom':
          // 获取在场的所有方块并转换为升序数组
          p = [...document.querySelectorAll('p')].sort((a, b) => b.offsetTop - a.offsetTop)
          // 遍历所有元素
          p.forEach((value) => {
            let i = 0,
              gu = true,
              bei = null,
              tec = false
            // 获取含有d_td属性的td
            let td = [...document.querySelectorAll('td[d_td]')]
            while (gu) {
              // 判断要移动的位置是否有元素或超出范围
              gu = !(
                value.offsetTop + i * 51 + 51 > 153 ||
                td.some((_td) => {
                  if (_td.offsetLeft === value.offsetLeft && _td.offsetTop === value.offsetTop + i * 51 + 51) {
                    bei = _td
                  }
                  return _td.offsetLeft === value.offsetLeft && _td.offsetTop === value.offsetTop + i * 51 + 51
                })
              )
              // 若没有则 i 加一 好判断下一个位置
              if (gu) {
                i++
              }
              // 若有则给对应的方块添加标识
              if (bei && value.innerText === bei.getAttribute('d_td')) {
                ;[...document.querySelectorAll('p')]
                  .filter((val) => val.getAttribute('top') == bei.offsetTop && val.getAttribute('left') == bei.offsetLeft)
                  .forEach((value) => {
                    value.setAttribute('san', 0)
                  })
                // 累加
                value.innerText = value.innerText * 2
                // 并使方块额外前进一格
                i++
                tec = true
                // 设置对应的分数
                grade += value.innerText * 1
                co.innerHTML = grade
              }
            }
            // 删除标识方块
            if (tec) {
              clearTimeout(aaa)
              aaa = setTimeout(function () {
                ;[...document.querySelectorAll('p[san]')].forEach((element) => {
                  div.removeChild(element)
                })
              }, 200)
            }
            // 让方块移动
            value.style.top = value.offsetTop + i * 51 + 'px'
            value.setAttribute('left', value.offsetLeft)
            value.setAttribute('top', value.offsetTop + i * 51)
            // 移除之前的标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop) {
                ad.removeAttribute('d_td')
                return true
              }
            })
            // 添加标识
            ;[...document.querySelectorAll('td')].some((ad) => {
              if (ad.offsetLeft === value.offsetLeft && ad.offsetTop === value.offsetTop + i * 51) {
                ad.setAttribute('d_td', value.innerText)
                return true
              }
            })
          })

          break
      }
    }
    //操作提示
    const tishi = document.getElementsByClassName('tishi')
    if (document.body.offsetWidth < 1000) {
      tishi[0].innerText = '通过手指滑动进行操作'
    }
  })
})()
