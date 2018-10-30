'use strict';

exports.mysql = {
  db1: {
    // 数据库名默认
    database: '',
  },
  default: {
    // host
    host: '',
    // 端口号
    port: '3306',
    // 用户名
    user: '',
    // 密码
    password: '',
  },
};
exports.auth = {
  enable: false,
  authWhiteList: [
  ],
};
exports.jwt = {
  enable: false,
  secret: '7971297368612863812',
};
