var Event = require("models/server/Event");

module.exports.byFullUrl = function(req, res, next) {
  var year = parseInt(req.params.year)
  var month = parseInt(req.params.month)-1
  var date = parseInt(req.params.date)
  var title = req.params.title
  Event.getByDateAndTitle(year, month, date, title, function(err, event){
    if(err) return next(err);
    if(!event) return res.send('event not found', 404)
    res.locals.event = event;
    next();
  })
}
