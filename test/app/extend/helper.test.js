'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/extend/helper.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'example',
      framework: true,
    });
    return app.ready();
  });

  after(() => app.close());

  afterEach(mock.restore);

  it('should get sowings', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.h.getSowings();
    assert(result.length > 0);
  });

  it('should get error sowings', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.h.getSowingsError();
    assert(result == null);
  });

  it('should get tran result', async () => {
    const ctx = app.mockContext();
    const dateTime = Date.now();
    const result = await ctx.service.h.getSowingsTran(dateTime);
    assert(result !== null && result.length > 0 && result[0].title === dateTime.toString());
  });

  it('should not get tran result', async () => {
    const ctx = app.mockContext();
    const dateTime = 555;
    const result = await ctx.service.h.getSowingsTranError(dateTime);
    assert(result === null);
  });

  it('should get m query', async () => {
    const ctx = app.mockContext();
    const id = 1;
    const result = await ctx.service.h.getSowingsMquery(id);
    ctx.logger.info('should get m query-->' + JSON.stringify(result));
    assert(result.length > 0);
  });

  it('should not get m query', async () => {
    const ctx = app.mockContext();
    const id = 39;
    const result = await ctx.service.h.getSowingsMqueryError(id);
    ctx.logger.info('should not get m query-->' + JSON.stringify(result));
    assert(result === null);
  });

  it('should get m tran', async () => {
    const ctx = app.mockContext();
    const id = 39;
    const result = await ctx.service.h.getSowingsMTran(id);
    ctx.logger.info('should get m tran-->' + JSON.stringify(result));
    assert(result.length > 0);
  });

  it('should not get m tran', async () => {
    const ctx = app.mockContext();
    const id = 39;
    const result = await ctx.service.h.getSowingsMTranError(id);
    ctx.logger.info('should not get m tran-->' + JSON.stringify(result));
    assert(result === null);
  });

  it('should get Time', async () => {
    const ctx = app.mockContext();
    const time = ctx.helper.time.getCurrentTime();
    ctx.logger.info('time', time);
    assert(time !== null);
  });


});
