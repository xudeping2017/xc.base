# xc.base

base framework of our egg

## QuickStart

```bash
$ npm install
$ npm test
```

##API
###BaseController
```js
//简化helper获取方式由this.ctx.helper 简化为this.helper
get helper()

// 错误统一处理 status 为200 http返回 
//  {
//   code: 500,
//   message: err.message,
//  }
error(err)

//content为错误内容可为object status为200 http返回
// {
//   code: 500,
//   message: err.message,
//   content
// }
errorContent(err, content)

// 成功统一处理 如果data为null则统一处理为执行失败错误
// {
//   code: 0,
//   message: 'success',
//   content: data,
// }
success(data)

//统一成功和失败错误处理
//如果asycnfunction 抛出错误则执行失败处理
async result(asyncFunction)

//统一处理 http参数验证及错误处理
//info验证泛型,body为验证目标对象
//body如果为undefined 默认验证request.body
//如果验证成功返回 true
//如果验证失败返回 false 并统一按照errorContent处理错误
validate(info, body)
```
###DbController DbService
DbController 继承自BaseController  
```js
//获取helper里面的数据库对象 简化db的获取为this.db
get db()

//直接执行sql语句 框架统一处理错误，无错误抛出
async doQuery(_sql)

//直接执行sql语句 有错误抛出
async doQueryError(_sql)

//执行事务
async tran(asyncFunction)

//事务回调里面直接执行sql语句
async doQueryConn(conn,_sql)

//多数据源执行sql语句
async doMQuery(dbId,_sql)

//多数据源执行事务
async tranM(dbId,asyncFunction)

//统一防sql注入处理，sql语句里面的参数用this.to()包裹
 to(params)
```
###helper
```js
  //数据库操作相关 已集成到DbService和DbController 如果需要自行实现见源码
  helper.db

  //时间操作相关
  helper.time
  // 获取当前时间格式 YYYY-MM-DD HH:mm:ss.SSS
  helper.time.getCurrentTime()
```
### report中间件 reportEnd中间件
统一为http请求加上唯一requestId 追加到 httpQuery
统一打印 http请求入参
统一打印 http执行耗时及结束标志

###config
```js
// mysql 数据库配置
const mysqlCon = {
  clients: {
    // clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
    db1: {
      // 数据库名默认
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

```

##Example
###BaseController

```js
'use strict';
const Controller = require('xc.base').BaseController;

class TemplateController extends Controller {
  async create() {
    if (!this.validate({
      name: { type: 'string' },
      userid: { type: 'string' },
    })) return;
    const { ctx, service } = this;
    //注意 result 里面没有 await
    await this.result(service.template.create(ctx.request.body));
  }

  async list() {
    await this.success(await this.service.template.list());
  }
}
module.exports = TemplateController;
```
###DbService
```js
'use strict';
const Service = require('xc.base').DbService;
class TemplateService extends Service {
  async create(info) {
    return await this.doQueryError(
      `insert into xc_p_template(name,createtime,updatetime,createuser,updateuser) values(
          ${this.to(info.name)},${this.to(this.helper.time.getCurrentTime())},${this.to(this.helper.time.getCurrentTime())}
        ,${this.to(info.userid)},${this.to(info.userid)})`
    );
  }
  async list() {
    return await this.doQuery('select * from xc_p_template');
  }
  async getSowingsTran(dateTime) {
    return await this.tran( async conn => {
      const _sql1 = `update xc_config_sowing set title = ${this.to(dateTime)} where id = 39`;
      await this.doQueryConn(conn, this_sql1);
      const _sql2 = 'select * from xc_config_sowing where id = 39';
      const result = await this.doQueryConn(conn, _sql2);
      this.logger.info(`dateTime=${dateTime}`);
      this.logger.info(`result=${JSON.stringify(result)}`);
      return result;
    });
  }
}
module.exports = TemplateService;

```
###config
```js
//覆盖写出字段名 保留未写出字段
exports.mysql = {
    clients: {
      db1: {
        database: 'aaa',
      },
    },
  };
```

## Questions & Suggestions

Please open an issue [here](https://github.com/xudeping2017/xc.base/issues).

