'use strict';
const Controller = require('egg').Controller;

class BaseController extends Controller {
  // 获取helper
  get helper() {
    return this.ctx.helper;
  }
  // 错误统一处理 status 为200
  error(err) {
    if (err instanceof this.app.xcError) {
      throw err;
    } else {
      throw (new this.app.serverError(err.message));
    }
  }

  errorContent(err, content) {
    if (err instanceof this.app.xcError) {
      throw err;
    } else {
      throw (new this.app.serverError(err.message, content));
    }
  }
  // 成功统一处理 如果data为null则统一处理为执行失败错误
  success(data) {
    if (!data) {
      throw (new this.app.serverError('执行失败!'));
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
      await asyncFunction;
      this.success([]);
    } catch (err) {
      if (err instanceof this.app.xcError) {
        throw err;
      } else {
        throw (new this.app.serverError(err.message));
      }
    }
  }

  validate(info, body) {
    try {
      if (body) {
        this.ctx.validate(info, body);
      } else {
        this.ctx.validate(info);
      }
    } catch (err) {
      throw new this.app.validateError(undefined, err.errors);
    }
  }
}
module.exports = BaseController;
