'use strict';
const BaseService = require('./base-service');
/**
 * 数据库Service基类
 */
class DbService extends BaseService {
  // 获取helper里的数据库对象
  get db() {
    return this.helper.db;
  }
  // 为直接使用mysql模块的escape
  get mql() {
    return require('mysql');
  }
  /**
   * 直接用db1执行sql
   * @param {string} _sql sql语句
   * @return {Promise} Promise
   */
  async doQuery(_sql) {
    return await this.db.doQuery(_sql, this);
  }
  /**
   * 直接用db1执行sql 抛出错误
   * @param {string} _sql sql语句
   * @return {Promise} Promise
   */
  async doQueryError(_sql) {
    return await this.db.doQueryError(_sql, this);
  }
  /**
   * 在tran执行事务的时候使用可以传递统一的conn数据库连接
   * @param {object} conn 数据库连接
   * @param {string} _sql sql语句
   *  @return {Promise} Promise
   */
  async doQueryConn(conn, _sql) {
    return await this.db.doQueryConn(_sql, conn, this);
  }
   /**
   * 在tran执行事务的时候使用可以传递统一的conn数据库连接 抛出错误
   * @param {object} conn 数据库连接
   * @param {string} _sql sql语句
   *  @return {Promise} Promise
   */
  async doQueryConnError(conn, _sql) {
    return await this.db.doQueryConnError(_sql, conn, this);
  }
  /**
   * 执行事务
   * @param {asyncFunction} asyncFunction 事务执行 async回调方法
   * @return {Promise} Promise
   */
  async tran(asyncFunction) {
    return await this.db.tran(this, asyncFunction);
  }
    /**
   * 执行事务 抛出Error
   * @param {asyncFunction} asyncFunction 事务执行 async回调方法
   * @return {Promise} Promise
   */
  async tranError(asyncFunction) {
    return await this.db.tranError(this, asyncFunction);
  }
  /**
   * 执行多数据源sql
   * @param {string} dbId 数据源id
   * @param {string} _sql sql语句
   *  @return {Promise} Promise
   */
  async doMQuery(dbId, _sql) {
    const conn = this.app.mysql.get(dbId);
    return await this.db.doQueryConn(_sql, conn, this);
  }
  /**
   * 执行多数据源事务
   * @param {string} dbId 数据源id
   * @param {string} asyncFunction 事务执行 async回调方法
   * @return {Promise} Promise
   */
  async tranM(dbId, asyncFunction) {
    const conn = this.app.mysql.get(dbId);
    return this.db.tranConn(this, conn, asyncFunction);
  }
  /**
   * 执行多数据源事务 抛出错误
   * @param {string} dbId 数据源id
   * @param {string} asyncFunction 事务执行 async回调方法
   * @return {Promise} Promise
   */
  async tranMError(dbId, asyncFunction) {
    const conn = this.app.mysql.get(dbId);
    return this.db.tranConnError(this, conn, asyncFunction);
  }
  /**
   * 防sql注入处理
   * @param {object} params sql中需要处理的字段
   * @return {object} object
   */
  to(params) {
    return this.mql.escape(params);
  }
}
module.exports = DbService;
