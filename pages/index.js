module.exports = function(config){
  return {
    "* *": this.version,
    "GET": [
      this["last-3-blog-posts"],
      function(req, res) {
        res.sendPage();
      }
    ]
  }
}