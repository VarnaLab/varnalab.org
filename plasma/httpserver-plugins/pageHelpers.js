var _ = require("underscore")
module.exports = function(config, httpServer){
  return function(req, res, next) {
    res.result = function(data){
      res.json({result: data});
    }
    res.error = function(msg){
      res.send({result: msg}, 500);
    }
    res.sendPage = function(path, data, statusCode){
      var renderData = _.extend({}, req, data)
      var html = jadefy(__dirname+"/../../context/UI/pages/"+path+".jade")(renderData);
      res.send(html, statusCode?statusCode:200);
    }
    next();
  }
}