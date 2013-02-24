module.exports = function(chemical, callback) {
  chemical.data = {
    test: this.config.apiEndpoint
  }
  callback(chemical);
}