'use strict';
const { app, assert } = require('egg-mock/bootstrap');

describe(__filename, () => {
  it('doQuery', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.base.dbService.doQuery('select * from xc_config_sowing');
    assert(result.length > 0);
  });
  it('tran doMQuery', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.base.dbService.tran(async () => {
      return await ctx.service.base.dbService.doMQuery('db1', `select * from xc_config_sowing where id < ${ctx.service.base.dbService.to(100)} limit 1`);
    });
    assert(result.length === 1);
  });
  it('tranM doQueryConn', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.base.dbService.tranM('db1', async conn => {
      return await ctx.service.base.dbService.doQueryConn(conn, `select * from xc_config_sowing where id < ${ctx.service.base.dbService.to(100)} limit 2`);
    });
    assert(result.length === 2);
  });

});

