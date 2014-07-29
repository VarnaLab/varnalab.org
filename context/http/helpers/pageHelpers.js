var _ = require("underscore")
var excludeKeys = ["stale","fresh"]
var cloneReqData = function(req) {
  var result = {}
  for(var key in req) {
    if(excludeKeys.indexOf(key) != -1)
      continue
    try {
      result[key] = req[key]
    } catch(err){
      console.error(key, err)
    }
  }
  return result
}

module.exports = function(req, res, next) {
  res.result = function(data){
    res.json({result: data});
  }
  res.error = function(msg){
    res.send({result: msg}, 500);
  }
  res.sendPage = function(path, data, statusCode){
    var reqData = cloneReqData(req)
    var renderData = _.extend({}, reqData, data)
    var fullPath = path.indexOf("/") === 0?path:__dirname+"/../../UI/pages/"+path+".jade"
    var html = jadefy(fullPath)(renderData);
    res.send(html, statusCode?statusCode:200);
  }
  next();
}