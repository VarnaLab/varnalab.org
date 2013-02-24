var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var fs = require("fs");
var browserify = require('browserify');
var jade = require('jade');

var jsp = require("uglify-js").parser
var pro = require("uglify-js").uglify

var _ = require("underscore");
var path = require("path");

module.exports = function BundleCode(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  var cache = {};
  if(config.useCache)
    console.log("using code caching");
  
  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  this.config = config;
  
  this.on("BundleCode", function(chemical, sender, callback){

    var target = (chemical.root || config.root || "")+(chemical.code || config.code);
    if(target.indexOf(".js") === -1)
      target += ".js";
    
    if(cache[target] && config.useCache) {
      chemical.data = cache[target];
      return callback(chemical);
    }

    // combine
    b = browserify({debug: config.debug});

    if(config.plugins) {
      _.each(config.plugins, function(pluginConfig){
        pluginConfig = _.clone(pluginConfig);
        if(pluginConfig.arguments)
          pluginConfig.arguments = _.clone(pluginConfig.arguments);

        var plugin = require(process.cwd()+pluginConfig.source);
        b.use(plugin.apply(plugin, pluginConfig.arguments));
      });
    }
    b.addEntry(target);
    cache[target] = b.bundle();
    
    if(config.uglify) {
      ast = jsp.parse(cache[target])
      ast = pro.ast_mangle(ast)
      ast = pro.ast_squeeze(ast)
      cache[target] = pro.gen_code(ast)
    }

    cache[target] = new Buffer(cache[target]);
    chemical.data = cache[target];

    callback(chemical);
  });
}

util.inherits(module.exports, Organel);