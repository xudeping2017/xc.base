'use strict';
const DbController = require('egg').DbController;
class TdbController extends DbController {
  async query() {
    const result = await this.doQuery('select * from xc_config_sowing');
    this.success(result);
  }
  async tran_doMquery() {
    const result = await this.tran(async () => {
      return await this.doMQuery('db1', `select * from xc_config_sowing where id < ${this.to(100)} limit 1`);
    });
    this.success(result);
  }
  async tranM_doMqueryConn() {
    const result = await this.tranM('db1', async conn => {
      return await this.doQueryConn(conn, `select * from xc_config_sowing where id < ${this.to(100)} limit 2`);
    });
    this.success(result);
  }
  async queryError() {
    const result = await this.doQuery('select 1* from xc_config_sowing');
    this.success(result);
  }
}
module.exports = TdbController;
