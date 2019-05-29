/**
 * @author {Mr.Martin}
 * @description {函数组合, 将嵌套函数调用变成从右往左调用, 代码可读性大大增加}
 * @param {function} 需要嵌套调用的函数
 * @returns {function} 最终调用的函数
 */

(function(root) {
  const slice = Array.prototype.slice

  const compose = function() {
    const length = arguments.length
    let start = length - 1
    const arg = slice.call(arguments)
    return function() {
      let result = arg[start--].apply(this, arguments) // 第一调用函数返回的结果
      while(start >= 0) {
        result = arg[start--][Array.isArray(result) ? 'apply' : 'call'](this, result)
      }
      return result
    }
  }

  const f = function(x, y) {
    return [x, y]
  }

  const x = function(y) {
    return function(z) {
      return [z, y]
    }
  }

  const c = compose(f, x('我是组合1'))
  console.log(c('我是组合2'));
 })(typeof window !== 'undefined' ? window : global)