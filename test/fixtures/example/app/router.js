'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/doQuery', controller.tdb.query);
  router.get('/doQueryError', controller.tdb.queryError);
  router.get('/tran_doMquery', controller.tdb.tran_doMquery);
  router.get('/tranM_doMqueryConn', controller.tdb.tranM_doMqueryConn);

  router.get('/gzip/gt', controller.gzipController.gt1024);
  router.get('/gzip/gtNbody', controller.gzipController.gtNbody);
  router.post('/gzip/gtNJSON/:par', controller.gzipController.gtNJSON);

  router.get('/content', controller.sowing.content);
  router.get('/EContent', controller.sowing.EContent);
  router.post('/pContent', controller.sowing.pContent);
};
