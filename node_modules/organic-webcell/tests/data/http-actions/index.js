module.exports = function(config){
  return {
    "* *": function(req, res, next){
      if(req.query.testMiddleware)
        res.send(true);
      next();
    },
    "GET": this.sendTrue,
    "POST": this.sendTrue,
    "DELETE": this.sendTrue,
    "PUT": this.sendTrue,
    "GET /testFalse": this.sendFalse,
    "GET /testError": function(req, res) {
      res.error(true);
    },
    "GET /config": function(req, res){
      res.send(config);
    }
  }
}