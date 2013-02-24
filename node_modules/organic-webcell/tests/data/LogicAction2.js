var _ = require("underscore");

module.exports = function(chemical, callback) {
  chemical.data = _.extend(chemical.data, {
    test2: this.config.apiEndpoint
  })
  callback(chemical);
}