/**
 * @author {Mr.Martin}
 * @description {偏函数用处, 固定若干个参数, 用户只需要传入会变化的参数, 不需要重复传递相同的参数}
 * @param {function} 需要转化成偏函数的function
 * @returns {function} 转化出的偏函数
 */

 (function(root) {
  const slice = Array.prototype.slice

  const partial = function(fn) {
    const arg = slice.call(arguments, 1)
    return function() {
      arg.push(...slice.call(arguments))
      return fn.apply(this, arg)
    }
  }

  function add(a, b, c) {
    return [a, b, c]
  }

  const partialAdd = partial(add, 'a')
  console.log(partialAdd('b', 'c'));

 })(typeof window !== 'undefined' ? window : global)