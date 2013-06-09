var data = require("../../../_data");

module.exports = function(req, res, next) {
  data.loadAllMembers(function(err, members){
    if(err) return next(err);
    req.members = members;
    next();
  })
}