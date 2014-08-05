module.exports = function(req, res, next) {
  res.result = function(data){
    res.json({result: data});
  }
  res.error = function(msg){
    res.send({result: msg}, 500);
  }
  res.sendPage = function(path, data, statusCode){
    res.status(statusCode?statusCode:200).render(path, data)
  }
  next();
}