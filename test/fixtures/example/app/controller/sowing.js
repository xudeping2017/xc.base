'use strict';

const Controller = require('egg').DbController;

class SowingController extends Controller {
  async content() {
    if (!this.validate({
      userid: 'string',
    }, this.ctx.request.query)) return;

    await this.result(async () => {
      if (this.ctx.request.query.userid !== '1') {
        throw new Error('user not found');
      } else {
        return true;
      }
    });
  }
  async pContent() {
    const result = this.validate({
      userid: 'string',
    });
    if (!result) {
      return;
    }
    const { service } = this;
    await this.result(service.sowing.pContent());
  }
  async EContent() {
    this.ctx.body = await this.doQueryError('select * from xc_config_sowing');
  }
}
module.exports = SowingController;
