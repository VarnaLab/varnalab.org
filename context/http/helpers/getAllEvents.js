var Event = require("models/server/Event");

module.exports = function(req, res, next) {
  Event.find({}).populate("creator").sort({startDateTime: 1}).exec(function(err, events){
    if(err) return next(err);
    req.events = events;
    next();
  })
}
