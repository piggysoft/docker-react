var Promise = require('bluebird');

Promise.config({
  warnings: typeof __BUILD__ === 'undefined',
  longStackTraces: typeof __BUILD__ === 'undefined',
  cancellation: true
});

require("babel-runtime/core-js/promise").default = Promise;

Object.defineProperty(window, 'Promise', {
  get: function() {
    return Promise;
  },
  set: function() {
  }
});
