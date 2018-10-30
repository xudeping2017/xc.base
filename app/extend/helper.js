'use strict';
const moment = require('moment');
module.exports = {
  db: {
    // 直接执行sql  默认获取db1
    async doQuery(_sql, service) {
      try {
        const result = await service.app.mysql.get('db1').query(_sql);
        service.logger.info(`${_sql}-->Success!`);
        return result;
      } catch (error) {
        service.logger.error(`${_sql}-->Error!`);
        service.logger.error(error);
        return null;
      }
    },
    // 直接执行sql  默认获取db1 抛出错误
    async doQueryError(_sql, service) {
      try {
        const result = await service.app.mysql.get('db1').query(_sql);
        service.logger.info(`${_sql}-->Success!`);
        return result;
      } catch (error) {
        service.logger.error(`${_sql}-->Error!`);
        service.logger.error(error);
        throw new this.app.dbError(error.message);
      }
    },
    // 获取事物
    async tran(service, cb) {
      try {
        return await service.app.mysql.get('db1').beginTransactionScope(cb, service.ctx);
      } catch (error) {
        service.logger.error(error);
        service.ctx.logger.error('rollback!');
        return null;
      }
    },
    // 事物中执行sql
    async doQueryTran(_sql, conn, service) {
      let result = null;
      try {
        result = await conn.query(_sql);
        service.logger.info(`${_sql}-->Success!`);
      } catch (error) {
        service.logger.error(`${_sql}-->Error!`);
        throw new this.app.dbError(error.message);
      }
      return result;
    },
    // 多数据源执行sql
    async doQueryConn(_sql, conn, service) {
      try {
        const result = await conn.query(_sql);
        service.logger.info(`${_sql}-->Success!`);
        return result;
      } catch (error) {
        service.logger.error(`${_sql}-->Error!`);
        service.logger.error(error);
        return null;
      }
    },
    // 多数据源获取事物
    async tranConn(service, conn, cb) {
      try {
        return await conn.beginTransactionScope(cb, service.ctx);
      } catch (error) {
        service.logger.error(error);
        service.ctx.logger.error('rollback!');
        return null;
      }
    },
  },
  time: {
    // 获取当前时间格式 YYYY-MM-DD HH:mm:ss.SSS
    getCurrentTime() {
      return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    },
  },
};
