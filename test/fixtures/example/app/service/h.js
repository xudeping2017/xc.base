'use strict';
const Service = require('egg').Service;

class HService extends Service {

  async getSowings() {
    const _sql = 'select * from xc_config_sowing';
    const result = await this.ctx.helper.db.doQuery(_sql, this);
    return result;
  }
  async getSowingsError() {
    const _sql = 'select 1* from xc_config_sowing';
    const result = await this.ctx.helper.db.doQuery(_sql, this);
    return result;
  }
  async getSowingsTran(dateTime) {
    return await this.ctx.helper.db.tran(this, async conn => {
      const _sql1 = `update xc_config_sowing set title = ${conn.escape(dateTime)} where id = 39`;
      await this.ctx.helper.db.doQueryTran(_sql1, conn, this);
      const _sql2 = 'select * from xc_config_sowing where id = 39';
      const result = await this.ctx.helper.db.doQueryTran(_sql2, conn, this);
      this.logger.info(`dateTime=${dateTime}`);
      this.logger.info(`result=${JSON.stringify(result)}`);
      return result;
    });
  }
  async getSowingsTranError(dateTime) {

    return await this.ctx.helper.db.tran(this, async conn => {
      const _sql1 = `update xc_config_sowing set title = ${conn.escape(dateTime)} where id = 39`;
      await this.ctx.helper.db.doQueryTran(_sql1, conn, this);
      const _sql2 = `update xc_config_sowing set title = ${conn.escape(dateTime + 10000)} where id = 39`;
      await this.ctx.helper.db.doQueryTran(_sql2, conn, this);
      const _sql3 = `update xc_config_sowing set title = ${conn.escape(dateTime + 20000)} where id = 39`;
      await this.ctx.helper.db.doQueryTran(_sql3, conn, this);
      const _sql4 = 'select * from xc_config_sowing where id5 = 39';
      const result = await this.ctx.helper.db.doQueryTran(_sql4, conn, this);
      this.logger.info(`dateTime=${dateTime}`);
      this.logger.info(`result=${JSON.stringify(result)}`);
      return result;
    });
  }
  async getSowingsMquery(id) {
    const conn = this.app.mysql.get('db1');
    const _sql = `select *from xc_config_sowing where id> ${conn.escape(id)}`;
    return await this.ctx.helper.db.doQueryConn(_sql, conn, this);
  }
  async getSowingsMTran(id) {
    const db = this.ctx.helper.db;
    const conn = this.app.mysql.get('db1');
    return await db.tranConn(this, conn, async conn => {
      const _sql1 = `update xc_config_sowing set title = ${conn.escape(Date.now())} where id = ${conn.escape(id)}`;
      await this.ctx.helper.db.doQueryTran(_sql1, conn, this);
      const _sql4 = `select * from xc_config_sowing where id = ${conn.escape(id)}`;
      const result = await this.ctx.helper.db.doQueryTran(_sql4, conn, this);
      return result;
    });
  }
  async getSowingsMqueryError(id) {
    const conn = this.app.mysql.get('db1');
    const _sql = `select *from xc_config_sowing where id1> ${conn.escape(id)}`;
    return await this.ctx.helper.db.doQueryConn(_sql, conn, this);
  }
  async getSowingsMTranError(id) {
    const db = this.ctx.helper.db;
    const conn = this.app.mysql.get('db1');
    return await db.tranConn(this, conn, async conn => {
      const _sql1 = `update xc_config_sowing set title = ${conn.escape(Date.now())} where id1 = ${conn.escape(id)}`;
      await this.ctx.helper.db.doQueryTran(_sql1, conn, this);
      const _sql4 = `select * from xc_config_sowing where id = ${conn.escape(id)}`;
      const result = await this.ctx.helper.db.doQueryTran(_sql4, conn, this);
      return result;
    });
  }
}
module.exports = HService;
