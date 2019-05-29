/**
 * @author {Mr.Martin}
 * @description {
 *    优点: 函数记忆, 可缓存之前的数据结果
 *    缺点: 本质上其实是牺牲空间复杂度来换取时间复杂度, 在少量数据的时候反而执行效率会降低
 *    适用场景: 具有大量数据计算并且数据之间具有依赖的时候
 * }
 * @param {function} 需要嵌套调用的函数
 * @returns {function} 最终调用的函数
 */

(function(root) {
  const slice = Array.prototype.slice

  const memorize = function(fn) {
    const cache = {}
    return function() {
      const arg = slice.call(arguments)
      const key = JSON.stringify(arg.join('')) // join 对于对象会调用toString方法变成[object Object], 所以采用了序列化形式
      return cache[key] || (cache[key] = fn.apply(this, arg))
    }
  }

  function add(x, y) {
    console.log(x, y);
    return x + y
  }

  const memorizeAdd = memorize(add)

  console.log(memorizeAdd(1, 2));
  console.log(memorizeAdd(1, 2));
  console.log(memorizeAdd(1, 2));

 })(typeof window !== 'undefined' ? window : global)