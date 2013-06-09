var data = require("../../../_data");

module.exports = function(req, res, next) {
  data.loadAllEvents(function(err, events){
    if(err) return next(err);
    req.events = events;
    next();
  })
}