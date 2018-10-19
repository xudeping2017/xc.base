'use strict';

module.exports = {
  getError(errorMsg) {
    const error = new Error(errorMsg);
    this.logger.error(error);
    return error;
  },
};
