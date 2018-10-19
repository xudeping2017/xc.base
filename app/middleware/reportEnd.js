'use strict';
module.exports = () => {
  return async function(ctx, next) {
    await next();
    // 上报请求时间
    await reportLocalEnd(ctx, ctx.response.header['x-readtime']);
  };

};
async function reportLocalEnd(ctx, requestTime) {
  ctx.logger.info('requestInfo --> End', `requestTime=${requestTime}`);
}

