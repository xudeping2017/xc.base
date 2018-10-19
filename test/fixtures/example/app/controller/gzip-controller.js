'use strict';
const DbController = require('egg').DbController;
class GzipController extends DbController {
  async gt1024() {
    const buf = Buffer.alloc(1025, 'FF', 'UTF-8');
    this.success(buf.toString());
  }
  async gtNbody() {
    this.ctx.body = null;
  }
  async gtNJSON() {
    const buf = Buffer.alloc(1025, 'FF', 'UTF-8');
    this.ctx.body = buf.toString();
  }
}
module.exports = GzipController;
