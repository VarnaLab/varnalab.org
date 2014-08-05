var Event = require("models/server/Event");
var moment = require("moment");

module.exports = function(req, res, next) {
  Event.find({
    startDateTime: {
      $gt: moment().toDate()
    }
  })
  .populate("creator")
  .sort({startDateTime: 1})
  .exec(function(err, events){
    if(err) return next(err);
    res.locals.events = events;
    next();
  })
}
