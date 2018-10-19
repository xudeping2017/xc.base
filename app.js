'use strict';
const assert = require('assert');
module.exports = app => {
  // 将gzip插件添加到最前
  app.config.coreMiddleware.unshift('gzip');
  app.config.coreMiddleware.unshift('reportEnd');
  const index = app.config.coreMiddleware.indexOf('bodyParser');
  assert(index >= 0, 'bodyParser 中间件必须存在');
  // 将report插件添加到bodyParser插件之前
  app.config.coreMiddleware.splice(index + 1, 0, 'report');
};
