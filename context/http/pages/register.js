module.exports = function(){
  return {
    "GET": function(req, res) {
      res.sendPage("register");
    }
  }
}