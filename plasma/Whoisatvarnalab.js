var Organel = require("organic").Organel
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

var fetchDataIntervalID = setInterval(fetchData, 15*60*1000);
fetchData();

module.exports = Organel.extend(function(plasma, dna){
  Organel.call(this, plasma, dna)
  this.on("whoisatvarnalab", this.whoisatvarnalab)
  this.on("kill", function(){
    if(fetchDataIntervalID) {
      clearInterval(fetchDataIntervalID)
      fetchDataIntervalID = null
    }
  })
}, {
  whoisatvarnalab: function(c, next){
    next(null, {
      data: peopleOnline,
      timestamp: moment(lastFetchTimestamp).fromNow()
    })
    return false
  }
})