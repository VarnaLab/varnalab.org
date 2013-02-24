var gzip = require('connect-gzip')

module.exports = function(config, httpServer){
  return gzip.gzip();
}