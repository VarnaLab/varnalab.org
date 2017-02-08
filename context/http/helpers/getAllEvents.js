var Event = require("models/server/Event");
var _ = require("underscore");
var moment = require("moment");

var sortByStartDateTime = function(e){return e.startDateTime}

var orderUpcomingFirstDesc = function(events) {
  var upcoming = _.filter(events, function(e){
    return moment(e.startDateTime).diff(moment()) > 0
  })
  return _.sortBy(upcoming, sortByStartDateTime)
}

var orderPastRecentDesc = function (events) {
  var past = _.filter(events, function(e){
    return moment(e.startDateTime).diff(moment()) < 0
  })
  return _.sortBy(past, sortByStartDateTime).reverse()
}

module.exports = function (pageNumberParamName, limit) {
  return function(req, res, next) {
    var pageNumber = req.params[pageNumberParamName]?parseInt(req.params[pageNumberParamName]):0
    var skip = pageNumber*limit
    Event.find({}).populate("creator")
      .sort({startDateTime: -1})
      .exec(function(err, events){
        if(err) return next(err);
        res.locals.events = events;
        res.locals.eventsUpcomingOrder = orderUpcomingFirstDesc(events)
        res.locals.pastEvents = orderPastRecentDesc(events)
        res.locals.pastEventsCount = res.locals.pastEvents.length
        res.locals.pastEvents = res.locals.pastEvents.splice(skip, limit)
        res.locals.pastEventsLimit = limit
        res.locals.pageNumber = pageNumber
        next();
      })
  }
}
