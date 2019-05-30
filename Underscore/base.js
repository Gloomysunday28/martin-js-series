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

  _.isFunction = function(fn) {
    return typeof fn === 'function'
  }
  
  _.mixin = function(obj) { // 提供新的方法给_.prototype 和 _, 方便实现面向对象和函数式调用两种方法
    const push = Array.prototype.slice
    Object.keys(obj).forEach(o => {
      const fn = obj[o]
      if (_.isFunction(fn)) {
        _.prototype[o] = function() {
          const oToObject = [...this._wrapped]
          push.call(oToObject, ...arguments)
          return fn.apply(this, oToObject)
        }
        _[o] = function() {
          return fn.apply(this, ...arguments)
        }
      }
    })
  }

  _.mixin({
    addOne(x, y) {
      return x + y
    }
  })

  console.log(_([1, 2]).addOne());
  console.log(_.addOne([1, 2]));

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