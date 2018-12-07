'use strict';
const assert = require('assert');
module.exports = async app => {
  // 统一处理body传参解析掉header和body 如果有auth中间件放在 auth中间件之后
  const authIndex = app.config.coreMiddleware.indexOf('auth');
  if (authIndex >= 0) {
    app.config.coreMiddleware.splice(authIndex + 1, 0, 'formatBody');
  } else {
    app.config.coreMiddleware.unshift('formatBody');
  }
  // 将formatCookie中间件添加到jwt中间件之前
  const jwtIndex = app.config.coreMiddleware.indexOf('jwt');
  if (jwtIndex >= 0) {
    app.config.coreMiddleware.splice(jwtIndex -1 , 0, 'formatCookie');
  } else {
    app.config.coreMiddleware.unshift('formatCookie');
  }
  app.config.coreMiddleware.unshift('koaStatic');
  app.config.coreMiddleware.unshift('gzip');


  // 统一错误处理中间件
  app.config.coreMiddleware.unshift('errorHandler');
  const index = app.config.coreMiddleware.indexOf('bodyParser');
  assert(index >= 0, 'bodyParser 中间件必须存在');
  // 将report插件添加到bodyParser插件之后
  app.config.coreMiddleware.splice(index + 1, 0, 'report');
  await require('./lib/initApi')(app)
};
