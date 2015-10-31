var Promise = require('bluebird');

Promise.config({
  warnings: typeof __BUILD__ === 'undefined',
  longStackTraces: typeof __BUILD__ === 'undefined',
  cancellation: true
});

Object.defineProperty(window, 'Promise', {
  get: function() {
    return Promise;
  },
  set: function() {
  }
});

require('babel-plugin-transform-regenerator/runtime');

if (typeof Object.assign == 'undefined') {
  Object.defineProperty(Object, 'assign', {
    enumerable  : false,
    configurable: true,
    writable    : true,
    value       : function(target) {
      'use strict';
      if (typeof __BUILD__ === 'undefined' && target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}

if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = function bind(obj) {
    var args        = Array.prototype.slice.call(arguments, 1),
        self        = this,
        nop         = function() {
        },
        bound       = function() {
          return self.apply(
            this instanceof nop ? this : (obj || {}), args.concat(
              Array.prototype.slice.call(arguments)
            )
          );
        };
    nop.prototype   = this.prototype || {};
    bound.prototype = new nop();
    return bound;
  };
}
