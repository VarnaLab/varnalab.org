module.exports = function(config){
  return {
    "* *": this.version,
    "GET": function(req, res) {
      res.sendPage();
    }
  }
}