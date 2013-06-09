var st = require('st');

module.exports = function(config, httpServer) {
  var target = config.path;
  if(target.indexOf("/") === 0)
    target = process.cwd()+target;
  config.path = target;
  config.url = config.url || "/";
  return st(config);
}