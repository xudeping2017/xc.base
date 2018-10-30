'use strict';
module.exports = () => {
  return async function(ctx, next) {
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
