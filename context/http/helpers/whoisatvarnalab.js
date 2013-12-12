var request = require("request");
var _ = require("underscore");
var moment = require("moment")
moment.lang("bg")

var peopleOnline = [];
var lastFetchTimestamp = new Date()

var Person = module.exports.Person = function(data){
  _.extend(this, data);
}

var getOptions = {uri: "http://hq.varnalab.org/list.php", json:{}};

var fetchData = function(){
  request.get(getOptions, function(err, res, body){
    if(err) return;
    peopleOnline = _.map(body, function(item){ return new Person(item); });
    lastFetchTimestamp = new Date()
  });
}

setInterval(fetchData, 15*60*1000);
fetchData();

module.exports = function(req, res, next){
  req.whoisatvarnalab = {
    data: peopleOnline,
    timestamp: moment(lastFetchTimestamp).fromNow()
  }
  next();
}