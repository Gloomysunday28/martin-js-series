/**
 * @author {Mr.Martin}
 * @description {学underscore适配所有终端写法}
 */

 (function() {
   var root = (typeof self !== 'undefined' && self.window && self) ||
              (typeof global !== 'undefined' && global.global && global) ||
              this || {}

  root._ = _
 })()