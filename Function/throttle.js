/** 
 * @author {Mr.Martin}
 * @description {函数节流, 当事件不断触发的时候, 隔一段时间执行该函数, 在结束后还会在执行一次}
 * @param {function}
 * @param {wait}
 * @returns {function}
*/

(function() {
  const throttle = function(fn, wait) {
    let timer = null
    let oldDate = +new Date()

    return function() {
      let nowDate = +new Date()

      if (nowDate - oldDate < wait) {
        if (timer) clearTimeout(timer)

        timer = setTimeout(_ => {
          fn && fn.apply(this, arguments)
        }, wait)
      } else {
        fn && fn.apply(this, arguments)
        oldDate = nowDate
      }
    }
  }
  
  const oDiv = document.querySelector('div')
  // const oButton = document.querySelector('button')
  oDiv.innerHTML = 0

  const throttled = throttle(function() {
    oDiv.innerHTML = +oDiv.innerHTML + 1
  }, 1000, true)

  document.body.onmousemove = throttled
  // oButton.onclick = function() {
  //   debounced.cancel()
  // }
})()