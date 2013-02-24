var glob = require('glob');
var path = require("path");

module.exports.relativePath = function(file, root) {
  return file.split("\\").join("/").replace(root.split("\\").join("/"), "");
}

module.exports.createNamespace = function(container, _path, value) {
  var parts = _path.split(path.sep);
  if(parts.length>2) {
    var name = parts.shift();
    container[name] = {};
    container = container[name];
    module.exports.createNamespace(container, parts.join(path.sep), value);
  } else
    container[_path] = value;
}

module.exports.scan = function(config, context, callback){
  glob(config.root+"/**/*"+config.extname, function(err, files){
    files.forEach(function(file){
      var target = module.exports.relativePath(file, config.root+path.sep).replace(config.extname, "");
      module.exports.createNamespace(context, target, require(file));
    });
    callback(err);
  });
}