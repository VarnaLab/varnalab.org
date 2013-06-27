module.exports = function(config){
  var User = require(config.models+"/User");

  return {
    "GET": [this.getAllEvents, this.eventsCount, function(req, res){
      req.eventsCount = req.events.length;

      User.findOne({name:'Касичка'}, function (err, user) {
        // console.log('---------------------------------');
        // console.log(err);
        // console.log(user);
        // console.log('---------------------------------');

        req.data = user._id;
        // req.data = user._id;
        res.sendPage("charts/index");
      });
    }]
  }
}