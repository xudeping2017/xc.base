'use strict';
const uuid = require('uuid');
module.exports = (options, app) => {
  return async function errorHandler(ctx, next) {
    const requestId = uuid.v1();
    if (ctx.request.query.requestId) {
      ctx.request.query = Object.assign(ctx.request.query, {
        requestId: `${ctx.query.requestId}_${requestId}`,
      });
    } else {
      ctx.request.query = Object.assign(ctx.request.query, {
        requestId,
      });
    }
    try {
      await next();
    } catch (error) {
      ctx.logger.error(error);
      ctx.status = 200;
      let body = {};
      if (error.constructor.name === 'UnauthorizedError') {
        error = new app.jwtError();
      }
      if (error instanceof app.xcError) {
        body = error.allProp();
      } else {
        body.code = 500;
        body.type = error.message;
      }
      ctx.body = body;
    }
    switch (ctx.status) {
      case 200:
        break;
      case 404:
        ctx.body = {
          code: 404,
          message: 'not found',
        };
        break;
      default:
        ctx.body = {
          code: 500,
          message: ctx.body || 'server error!',
        };
        break;
    }
    // 上报请求时间
    if(ctx.path.indexOf('.html')===-1 && ctx.path.indexOf('.js')===-1 && ctx.path.indexOf('.css')===-1  && ctx.path.indexOf('.ico')===-1){
      try{
        if(typeof ctx.body === 'string'){
          const body = JSON.parse(ctx.body);
          if(body.code === 0){
            ctx.logger.info('requestInfo --> End Success!', `requestTime=${ctx.response.header['x-readtime']}`);
          }else{
            ctx.logger.error('requestInfo --> End Failed!', `requestTime=${ctx.response.header['x-readtime'] || 0}\n FailedInfo:\n${JSON.stringify(body,2, 2 )}`);
          }
        }else{
          const body = ctx.body;
          if(body && body.code === 0){
            ctx.logger.info('requestInfo --> End Success!', `requestTime=${ctx.response.header['x-readtime']}`);
          }else{
            ctx.logger.error('requestInfo --> End Failed!', `requestTime=${ctx.response.header['x-readtime'] || 0}\n FailedInfo:\n${JSON.stringify(body,2, 2 )}`);
          }
        }
       
      }catch(error){
        ctx.logger.error('requestInfo --> End Failed!', `requestTime=${ctx.response.header['x-readtime'] || 0}\n FailedInfo:\n${ctx.body}`);
      }
   
    }
  
  };

};
