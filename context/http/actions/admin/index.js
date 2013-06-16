module.exports = function(config){
  var Member = require(config.models+"/Member");

  return {
    "GET": function(req, res) {
      if(!req.session.userId)
        return res.sendPage("403", 403);
      Member.findById(req.session.userId, function(err, member){
        req.member = member;
        res.sendPage("admin/index");
      })
    }
  }
}