'use strict';
const mock = require('egg-mock');
const assert = require('assert');
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

  it('should get 200', async () => {
    const result = await app.httpRequest()
      .get('/gzip/gt');
    app.logger.info(result.body);
    assert(result.status === 200);
    assert(result.body !== null);
  });

  it('should get 204 gtNbody', async () => {
    const result = await app.httpRequest()
      .get('/gzip/gtNbody');
    assert(result.status === 204);
  });

  it('should get 200 gtNJSON', async () => {
    // const result = await app.httpclient.request('http://127.0.0.1:51425/gzip/gtNJSON?requestId=123123213', {
    //   method: 'POST',
    //   contentType: 'json',
    //   data: {
    //     hello: 'world',
    //     now: Date.now(),
    //   },
    //   dataType: 'json',
    // });
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/gzip/gtNJSON/a?requestId=123123213')
      .type('json')
      .send({
        per: 'a',
        name: 'xudp',
      });

    assert(result.text === Buffer.alloc(1025, 'FF', 'UTF-8').toString());
  });


});

