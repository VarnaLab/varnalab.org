var data = require("../_data");
var _ = require("underscore");

module.exports = function(req, res, next){
  data.loadAllEvents(function(err, events){
    if(err) return next(err);
    req.previousCount = _.filter(events, function(e){ return !e.upcoming; }).length;
    req.upcomingCount = _.filter(events, function(e){ return e.upcoming; }).length;
    req.eventsCount = events.length;
    next();
  })
}