'use strict';

const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const BaseService = require('../app/service/base/base-service');
const DbService = require('../app/service/base/db-service');
const BaseController = require('../app/controller/base/base-controller');
const DbController = require('../app/controller/base/db-controller');
class Application extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

module.exports = Object.assign(egg, {
  Application,
  Agent,
  BaseService,
  DbService,
  BaseController,
  DbController,
});
