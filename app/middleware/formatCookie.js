'use strict';
module.exports = () => {
  return async function formateCookie(ctx, next) {
    const str = ctx.cookies.get('Authorization');
    if (isNotEmpty(str)) {
      Object.assign(ctx.header, { authorization: str });
    }
    await next();
  };
};
function isEmpty(str) {
  if (typeof str === 'undefined' || str === null || str === '') {
    return true;
  }
  return false;

}

function isNotEmpty(str) {
  return !isEmpty(str);
}
