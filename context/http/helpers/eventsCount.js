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
  Event.find({}, function(err, events){
    if(err) return next(err);
    res.locals.previousCount = _.filter(events, isOld).length;
    res.locals.upcomingCount = _.filter(events, isNew).length;
    res.locals.eventsCount = events.length;
    next();
  })
}