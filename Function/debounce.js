/** 
 * @author {Mr.Martin}
 * @description {函数防抖, 当事件不再触发的时候, 执行该函数}
 * @param {function}
 * @param {wait}
 * @param {immediate} 在不间断的触发事件立即执行第一次, 和原来的区别: immediate为true的时候事件在开始触发, 为false的时候事件在结束触发
 * @returns {function}
*/

(function() {
  const debounce = function(fn, wait, immediate) {
    let timer = null

    function debounced() {
      if (timer) clearTimeout(timer) // clearTimeout 无法消除timer变量值, 只有手动设置为null, 才视为消除
      if (immediate) { // 当事件在一定时间内不断触发, timer始终是有值的, function在这段时间内是不会执行的
        const cancelTime = !timer
        timer = setTimeout(_ => {
          timer = null
        }, wait)

        if (cancelTime) return fn && fn.apply(this, arguments)
      } else {
        timer = setTimeout(_ => {
          fn && fn.apply(this, arguments)
        }, wait)
      }
    }

    debounced.cancel = function() { // 如果wait时间过久, 可以重置防抖时间
      clearTimeout(timer)
      timer = null
    }

    return debounced
  }
  
  const oDiv = document.querySelector('div')
  const oButton = document.querySelector('button')
  oDiv.innerHTML = 0

  const debounced = debounce(function() {
    oDiv.innerHTML = +oDiv.innerHTML + 1
  }, 10000, true)

  document.body.onmousemove = debounced
  oButton.onclick = function() {
    debounced.cancel()
  }
})()