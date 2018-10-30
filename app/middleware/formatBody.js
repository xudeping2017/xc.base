'use strict';
module.exports = () => {
  return async function formatBody(ctx, next) {
    const request = ctx.request;
    if ((/GET|DELETE/i).test(request.method)) {
      delete request.query.appKey;

      delete request.query.appSecret;

      delete request.query.time;

      delete request.query.accessToken;
    } else {
      delete request.body.header;
      if (request.body.payload) {
        Object.assign(request.body, request.body.payload);
      }
      delete request.body.payload;
    }
    await next();
  };
};
