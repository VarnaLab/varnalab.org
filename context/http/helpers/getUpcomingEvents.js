var Event = require("models/server/Event");
var moment = require("moment");

module.exports = function(req, res, next) {
  Event.find({
    startDateTime: {
      $gt: moment().toDate()
    }
  }, function(err, events){
    if(err) return next(err);
    req.events = events;
    next();
  })
}