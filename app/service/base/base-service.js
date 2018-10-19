'use strict';
const Service = require('egg').Service;

class BaseService extends Service {
  get helper() {
    return this.ctx.helper;
  }
}
module.exports = BaseService;
