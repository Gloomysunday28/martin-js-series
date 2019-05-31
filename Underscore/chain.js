/**
 * @author {Mr.Martin}
 * @description {链式调用, 在每次调用完方法后能连续调用别的方法}
 */

 (function() {
  /**
   * chain函数为实例添加了一个属性, 为是否选择链式调用做准备
   */

  _.chain = function (obj) {
    var instance = _(obj)
    instance._chain = true
    return instance
  }
  _.push = function (obj, param) {
    this._wrapped.push(param)
    return chainResult(this, this._wrapped) // 为了函数式调用做链式准备
  }
  _.unshift = function (obj, param) {
    this._wrapped.unshift(param)
    return chainResult(this, this._wrapped) // 为了函数式调用做链式准备
  }

  _.value = function() {
    this._chain = false // 获取最后的值的时候, 如果是面向对象调用,那么需要取消掉该属性值, 不然返回的还是实例
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
          return chainResult(this, fn.apply(this, oToObject)) // 面向对象方式调用的时候, 判断返回的参数是实例还是值, 以便区分链式调用
        }
      }
    })

    return _
  }

  _.mixin(_)

  // console.log(_.chain([1,2,3]).push(4).unshift(5).value())
  //                  ||
  //                  ||   相
  //                  ||   等
  //                  ||
  console.log(_([1, 2, 3]).chain().push(4).unshift(5).value())
 })()