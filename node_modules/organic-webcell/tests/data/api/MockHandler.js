module.exports = function(chemical, config, callback) {
  chemical.data.test = config.apiEndpoint;
  callback();
}