module.exports = function(chemical, config, callback) {
  chemical.data.test2 = config.apiEndpoint;
  callback();
}