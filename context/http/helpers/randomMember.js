var Member = require("models/server/Member");
var _ = require("underscore");

module.exports = function(req, res, next) {
  Member.find({}, function(err, members){
    if(err) return next(err);
    if(members.length > 0)
      req.randomMember = members[_.random(members.length-1)];
    else
      req.randomMember = null;
    next();
  })
}