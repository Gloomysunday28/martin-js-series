/**
 * @author {Mr.Martin}
 * @description {学underscore适配所有终端写法}
 */

(function () {
  /**
   * 1. self -> 浏览器环境, self与window的区别是, self可以支持多个web Worker
   * 2. global -> node环境
   * 3. this -> node里的vm模块, 不具备global变量, 但是通过this却能访问到, vm模块支持了require和NodeJS的运行机制
   * 同时也可以创建独立运行的沙箱机制, JS可以被编译后立即执行或者编译保存下来稍后执行
   * 4. {} -> 微信小程序, 不具备self/global/this变量, 所以单独创建一个全局对象
   */
  var root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this || {}

  /**
   * @description {
   *  实现面向对象和函数式调用两种方法
   *  1. _.each([1, 2, 3], function() {}) 函数式调用
   *  2. _([1, 2, 3]).each(function() {}) 面向对象
   * }
   */

  var _ = function (param) {
    if (!(this instanceof _)) return new _(param); // 如果不是 _ 的实例, 就return一个实例
    this._wrapped = param; // 如果是 _ 的实例, 就将wrapped赋值为参数
  }

  _.slice = Array.prototype.slice

  _.isFunction = function (fn) {
    return typeof fn === 'function'
  }

  _.sub_curry = function (fn) {
    const args = _.slice.call(arguments, 1)
    return function () {
      /**
       * newParams: [实参列表]
       * fn: 上一次调用的函数
       */
      const newParams = args.concat(_.slice.call(arguments))
      return fn.apply(this, newParams) // 不断往外层冒出去
    }
  }

  _.compose = function () { // 函数组合
    let start = arguments.length - 1
    let arg = _.slice.call(arguments)
    return function () {
      let result = arg[start--].apply(this, arguments)

      while (start >= 0) {
        result = arg[start--].call(this, result)
      }

      return result
    }
  }

  _.debounce = function(fn, wait, immediate) { // 函数防抖
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

  _.throttle = function(fn, wait) { // 函数节流
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

  _.curry = function (fn, len) {
    let length = len || fn.length
    return function () {
      if (arguments.length < length) { // 如果调用函数的参数个数小于剩余需要传入的参数个数, 继续调用柯里化
        const combined = [fn]
        combined.push(..._.slice.call(arguments)) // 为了配合sub_curry第一步取消第一个参数
        return _.curry(_.sub_curry.apply(this, combined), length - arguments.length)
      } else {
        return fn.apply(this, arguments)
      }
    }
  }

  _.addOne = function (x, y) {
    return x + y
  }

  _.hasTwo = function (z) {
    return z
  }

  _.changeFn = function (fn) {
    return fn.apply(this, [1, 2])
  }

  _.chain = function (obj) {
    var instance = _(obj)
    instance._chain = true
    return instance
  }
  _.push = function (obj, param) {
    this._wrapped.push(param)
    return chainResult(this, this._wrapped)
  }
  _.unshift = function (obj, param) {
    this._wrapped.unshift(param)
    return chainResult(this, this._wrapped)
  }

  _.value = function() {
    this._chain = false
    return this._wrapped
  }

  function chainResult(instance, obj) {
    return instance._chain ? instance : obj
  }

  _.mixin = function (obj) { // 提供新的方法给_.prototype 和 _, 方便实现面向对象和函数式调用两种方法
    const push = Array.prototype.push
    Object.keys(obj).forEach(o => {
      const fn = obj[o]
      if (_.isFunction(fn)) { // 实参是数组形式
        _.prototype[o] = function () {
          const oToObject = [this._wrapped]
          push.apply(oToObject, arguments)
          return chainResult(this, fn.apply(this, oToObject))
        }
      }
    })

    return _
  }

  _.mixin(_)

  // console.log(_.chain([1,2,3]).push(4).unshift(5).value())
  console.log(_([1, 2, 3]).chain().push(4).unshift(5).value())

  // console.log(_([1, 2]).addOne());
  // console.log(_.addOne([1, 2]));
  // console.log(_([_.addOne]).changeFn());
  // console.log(_.changeFn(_.addOne));
  // console.log(_.compose(_.hasTwo, _.curry(function(x, y) {
  //   return x + y
  // })(1))(2));

  /**
   * 1. 早期版本Node只有exports没有module.exports, 后面的版本增加了module.exports
   * 2. exports.nodeType是为了防止HTML标签里有定义了id为exports的元素, 这样全局就会生成一个exports变量
   * 3. exports = module.exports = _: exports是module.exports的引用, 如果module.exports更换了引用地址, 那么exports也需要指向新地址
   */

  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
})()