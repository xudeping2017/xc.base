'use strict';
const koaStatic = require('koa-static');
module.exports = (options) => {
    return koaStatic(options.path);
}