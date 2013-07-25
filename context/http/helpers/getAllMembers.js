var Member = require("models/server/Member");

module.exports = function(req, res, next) {
  Member.find({}, function(err, members){
    if(err) return next(err);
    req.members = members;
    next();
  })
}