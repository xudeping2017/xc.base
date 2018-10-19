'use strict';
const Service = require('egg').DbService;


class SowingService extends Service {
  async pContent() {
    return await this.doQueryError('select *from aaa');
  }
}
module.exports = SowingService;
