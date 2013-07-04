module.exports = function(config){
  var Member = require(config.models+"/Member");
  var _ = require("underscore");

  return {
    "GET": function(req, res) {
      if(!req.session.userId)
        return res.sendPage("403", 403);

      Member.find({}, function(err, members){
        if(err) return res.error(err);

        var member = _.find(members, function(member){
          return member._id == req.session.userId
        });

        req.member = member;
        req.members = members;
        res.sendPage("admin/index");

      });
    }
  }
}