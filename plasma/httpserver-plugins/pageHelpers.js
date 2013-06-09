var _ = require("underscore");

module.exports = function(config, httpServer){
  var plasma = httpServer;
  return function(req, res, next) {
    res.result = function(data){
      res.json({result: data});
    }
    res.error = function(msg){
      res.send({result: msg}, 500);
    }
    res.sendPage = function(path, data, statusCode){
      var renderChemical = _.extend({}, req, data?data:{}, {
        type: "RenderPage", 
        page: __dirname+"/../../context/UI/pages/"+path
      });
      plasma.emit(renderChemical, function(c){
        if(c instanceof Error) return next(c);
        res.send(c.data, statusCode?statusCode:200);
      })
    }
    
    req.createModel = function(name) {
      var Model = require(__dirname+"/../../context/models/server/"+name);
      var model = new Model();
      model.sync = function(method, model, options){
        options.headers = req.headers;
        return Backbone.sync(method, model, options);
      }
      return model;
    }
    next();
  }
}