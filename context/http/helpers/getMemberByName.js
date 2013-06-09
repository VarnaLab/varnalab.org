var data = require("../../../_data");

module.exports = function(name) {
  return function(req, res, next) {
    data.getMemberByName(req.params[name], function(err, member){
      if(err) return next(err);
      req.member = member;
      next();
    })
  }
}