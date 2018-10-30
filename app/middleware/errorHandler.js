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
      const body = {};
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
    if (ctx.body.code !== 0) {
      ctx.logger.error('requestInfo --> End Failed!', `requestTime=${ctx.response.header['x-readtime'] || 0}\n FailedInfo:\n${JSON.stringify(2, 2, ctx.body)}`);
    } else {
      ctx.logger.info('requestInfo --> End Success!', `requestTime=${ctx.response.header['x-readtime']}`);
    }
  };

};
