var util = require("util");
var Organel = require("organic").Organel;

module.exports = function Logger(plasma, config){
  Organel.call(this, plasma);

  if(config.prefixConsoleWithTimestamps)
    require("../lib/clim")(console, true);

  var logger = console;
  this.config = config;

  if(config.attachHttpServerErrorMiddleware)
    this.on("HttpServer", function(chemical){
      if(chemical.data && chemical.data.app && chemical.data.app.use)
        chemical.data.app.use(function(err, req, res, next){
          logger.error(err.message, {stack: err.stack});
        });
      return false; // pass forward...
    });

  this.on("Logger", function(c, sender, callback){
    logger.log(c);
    if(callback) callback(c);
  });

  if(config.listenUncaughtExceptions)
    process.addListener("uncaughtException", function(err) {
      logger.error(err.stack);
    });
}

util.inherits(module.exports, Organel);