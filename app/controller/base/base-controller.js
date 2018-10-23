'use strict';
const Controller = require('egg').Controller;

class BaseController extends Controller {
  // 获取helper
  get helper() {
    return this.ctx.helper;
  }
  // 错误统一处理 status 为200
  error(err) {
    this.ctx.body = {
      code: 500,
      message: err.message,
    };
  }

  errorContent(err, content) {
    this.ctx.body = {
      code: 500,
      message: err.message,
      content:content
    };
  }
  // 成功统一处理 如果data为null则统一处理为执行失败错误
  success(data) {
    if (!data) {
      this.error(this.ctx.getError('执行失败!'));
    } else {
      this.ctx.body = {
        code: 0,
        message: 'success',
        content: data,
      };
    }
  }
  async result(asyncFunction) {
    try {
      await asyncFunction
      this.success([]);
    } catch (e) {
      this.error(this.ctx.getError(e.message));
    }
  }

  validate(info, body) {
    try {
      if (body) {
        this.ctx.validate(info, body);
      } else {
        this.ctx.validate(info);
      }
      return true;
    } catch (err) {
      this.ctx.logger.error(err);
      this.errorContent(err, err.errors);
      return false;
    }
  }
}
module.exports = BaseController;
