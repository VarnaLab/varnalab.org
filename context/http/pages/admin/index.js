module.exports = function(plasma, dna, helpers){
  var Member = require(process.cwd()+dna.models+"/Member");
  var _ = require("underscore");

  return {
    "GET": function(req, res) {
      if(!req.user)
        return res.sendPage("403", 403);
      res.locals.user = req.user
      res.sendPage("admin/index");
    }
  }
}