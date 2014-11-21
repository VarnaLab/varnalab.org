var Event = require("models/server/Event");
var _ = require("underscore");
var moment = require("moment");

var sortByStartDateTime = function(e){return e.startDateTime}

var orderUpcomingFirstDesc = function(events) {
  var upcoming = _.filter(events, function(e){ 
    return moment(e.startDateTime).diff(moment()) > 0
  })
  var rest = _.filter(events, function(e){ 
    return moment(e.startDateTime).diff(moment()) < 0
  })
  return _.sortBy(upcoming, sortByStartDateTime)
    .concat(_.sortBy(rest, sortByStartDateTime))
}

module.exports = function(req, res, next) {
  Event.find({}).populate("creator").sort({startDateTime: 1}).exec(function(err, events){
    if(err) return next(err);
    res.locals.events = events;
    res.locals.eventsUpcomingOrder = orderUpcomingFirstDesc(events)
    next();
  })
}
