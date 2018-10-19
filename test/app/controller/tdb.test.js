'use strict';

const mock = require('egg-mock');

describe(__filename, () => {
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

  it('doQuery', async () => {
    return app.httpRequest()
      .get('/doQuery')
      .expect(200);
  });
  it('tran_doMquery', async () => {
    return app.httpRequest()
      .get('/tran_doMquery')
      .expect(200);
  });
  it('tranM_doMqueryConn', async () => {
    return app.httpRequest()
      .get('/tranM_doMqueryConn')
      .expect(200);
  });
  it('doQueryError', async () => {
    return app.httpRequest()
      .get('/doQueryError')
      .expect(200);
  });
});

