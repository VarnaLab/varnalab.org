module.exports = function(config, httpServer){
  return function(req,res,next){
    res.sendPage("404", null, 404);
  }
}