require('../../polyfill');

var context = require.context('./specs/', true, /(.+)\.spec\.(js|jsx|ts|tsx)$/);
context.keys().forEach(context);
module.exports = context;
