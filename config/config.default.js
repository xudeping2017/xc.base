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
    host: '',
    // 端口号
    port: '',
    // 用户名
    user: '',
    // 密码
    password: '',
  },

  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};

const myRedis = {
  clients: {
    auth: { // instanceName. See below
      port: 6379, // Redis port
      host: 'localhost', // Redis host
      password: 'dalitek@123',
      db: 1,
    },
  },
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
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.redis = myRedis;
  // 配置 gzip 中间件的配置
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };
  config.auth = {
    enable: true,
    authWhiteList: [
    ],
  };
  config.jwt = {
    enable: true,
    secret: '7971297368612863812',
  };

  exports.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: 'zh-CN',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    cookieField: 'locale',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  };

  return config;
};
