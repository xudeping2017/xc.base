'use strict';
const uuid = require('uuid');
module.exports = () => {
  return async function(ctx, next) {
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
    reportLocalStart(ctx);
    await next();
  };
};


async function reportLocalStart(ctx) {
  const info = {
    query: ctx.request.query,
    body: ctx.request.body,
  };

  if (!info.body || (info.body && JSON.stringify(info.body) === '{}')) {
    delete info.body;
  }

  ctx.logger.info('requestInfo --> Start', JSON.stringify(info, 2, 2));
}
