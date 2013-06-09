var data = require("../../../_data");
var _ = require("underscore");

module.exports = function(req, res, next) {
  data.loadAllMembers(function(err, members){
    if(err) return next(err);
    if(members.length > 0)
      req.randomMember = members[_.random(members.length-1)];
    else
      req.randomMember = null;
    next();
  })
}