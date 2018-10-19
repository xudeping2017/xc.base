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
  it('not validate', async () => {
    return app.httpRequest()
      .get('/content')
      .expect(200);

  });

  it(' validate', async () => {
    return app.httpRequest()
      .get('/content?userid=1')
      .expect(200);

  });
  it(' validate error', async () => {
    return app.httpRequest()
      .get('/content?userid=2')
      .expect(200);
  });
  it(' validate EContent error', async () => {
    return app.httpRequest()
      .get('/EContent')
      .expect(200);
  });
  it(' validate pContent', async () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/pContent')
      .send({
        userid: '333',
      })
      .expect(200);

  });


});

