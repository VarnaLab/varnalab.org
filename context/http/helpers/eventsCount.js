var Event = require("models/server/Event");
var _ = require("underscore");
var moment = require("moment");

var isOld = function(e) {
  return moment(e.startDateTime).isBefore(moment())
}

var isNew = function(e) {
  return !isOld(e);
}

module.exports = function(req, res, next){
  Event.count({}, function(err, events){
    if(err) return next(err);
    req.previousCount = _.filter(events, isOld).length;
    req.upcomingCount = _.filter(events, isNew).length;
    req.eventsCount = events.length;
    next();
  })
}