module.exports = function(config) {
  return {
    "* *": function(req, res) {
      if(req.query.testMiddleware)
        res.send(true);
    },
    "GET": function(req, res) {
      res.sendPage();
    },
    "POST": this.sendTrue,
    "DELETE": this.sendTrue,
    "PUT": this.sendTrue
  }
}