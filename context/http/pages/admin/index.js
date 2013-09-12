module.exports = function(config){
  var Member = require(config.models+"/Member");
  var _ = require("underscore");

  return {
    "GET": function(req, res) {
      if(!req.session.passport.user)
        return res.sendPage("403", 403);
      res.sendPage("admin/index");
    }
  }
}