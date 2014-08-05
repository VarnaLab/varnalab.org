var Member = require("models/server/Member");

module.exports = function(name) {
  return function(req, res, next) {
    Member.find({ name: req.params[name] }, function(err, member){
      if(err) return next(err);
      res.locals.member = member;
      next();
    })
  }
}