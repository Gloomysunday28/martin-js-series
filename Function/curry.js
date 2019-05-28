/**
 * @author {Mr.Martin}
 * @description {函数柯里化}
 * @param {function}
 * @param {len} 剩余参数个数, 初始是函数总参数个数
 * @returns {function}
 */

(function(window) {
  // const log = window.console.log
  const slice = Array.prototype.slice

  const sub_curry = function(fn) {
    const args = slice.call(arguments, 1)
    return function() {
      /**
       * newParams: [实参列表]
       * fn: 上一次调用的函数
       */
      const newParams = args.concat(...slice.call(arguments))
      return fn.apply(this, newParams) // 不断往外层冒出去
    }
  }

  const curry = function(fn, len) {
    let length = len || fn.length
    
    return function() {
      if (arguments.length < length) { // 如果调用函数的参数个数小于剩余需要传入的参数个数, 继续调用柯里化
        const combined = [fn]
        combined.push(...slice.call(arguments)) // 为了配合sub_curry第一步取消第一个参数
        return curry(sub_curry.apply(this, combined), length - arguments.length)
      } else {
        return fn.apply(this, arguments)
      }
    }
  }

  function add(a, b, c, d) {
    return [a, b, c, d]
  }

  const curryAdd = curry(add)
  console.log(curryAdd('a', 'b')('c')('d'))
  /**
   * 分析步骤:
   * 1. curryAdd('a', 'b'):
   *   (1). 由于形参个数大于实参个数, 代码跳入递归状态
   *   (2). 执行sub_curry函数返回内部return的函数
   *   (3). curry的length变成剩余参数个数
   *   (4). 返回curry return出来的
   *   (5). 此时sub_curry的fn是 sub_curry return出来的函数(命名为curry_one), 此时curry_two里的fn.apply里的fn指向function add
   *   (6). args = ['a', 'b']
   * 
   * 2. curryAdd('c'):
   *   (1). 由于形参个数大于实参个数, 代码跳入递归状态
   *   (2). 重复第一个步骤
   *   (3). 此时sub_curry的fn是 sub_curry return出来的函数(命名为curry_two), 此时curry_two里的fn.apply里的fn指向curry_one
   *   (4). args = 'c'
   * 
   * 3. curryAdd('d'):
   *   (1). 由于形参个数和实参个数已经一致, 调用函数
   *   (2). 此时curry返回的fn是 sub_curry return出来的函数(命名为curry_three), 此时curry_two里的fn.apply里的fn指向curry_two
   *   (3). newParams为 'd'
   * 
   * 4. 
   *   (1). 此时curry里执行了函数, 也就是curry_three, newParams为'd', 并且执行了fn.apply(), 也就是curry_two
   *   (2). curry_two 传入实参'd', 与curry_two的args组合成['c', 'd'], 并且再次调用了fn.apply(), 也就是curry_one
   *   (3). curry_one 传入实参['c', 'd'], 与curry_one的args组合成['a', 'b', 'c', 'd'], 并且调用了fn.apply(), 也就是function add
   * 
   *  */
})(typeof window === 'undefined' ? global : window)
