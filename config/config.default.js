'use strict';


// mysql 数据库配置
const mysqlCon = {
  clients: {
    // clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
    db1: {
      // 数据库名
      database: 'xc_main',
    },
    db2: {
      // 数据库名
      database: 'xc_app',
    },
    // ...
  },
  // 所有数据库配置的默认值
  default: {
    // host
    host: 'rm-uf6pbta69814wyn43o.mysql.rds.aliyuncs.com',
    // 端口号
    port: '3306',
    // 用户名
    user: 'dal',
    // 密码
    password: 'dalitek@123',
  },

  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};


module.exports = appInfo => {
  const config = {};

  /**
   * some description
   * @member Config#test
   * @property {String} key - some description
   */
  config.test = {
    key: appInfo.name + '_123456',
  };
  config.mysql = mysqlCon;

  config.logger = {
    level: 'Debug',
    consoleLevel: 'INFO',
  };

  // 配置 gzip 中间件的配置
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };
  return config;
};
