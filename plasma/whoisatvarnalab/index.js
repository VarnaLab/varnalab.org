var _ = require("underscore")
var moment = require("moment")
moment.lang("bg")
var request = require('request')

var Person = module.exports.Person = function(data){
  this.host = data["host"];
  this.mac = data["mac"];
  this.ip = data["ip"];
}

module.exports = function(plasma, dna){

  this.updateInProgress = false
  this.peopleOnline = []
  this.lastFetchTimestamp = new Date()

  plasma.on("whoisatvarnalab", this.whoisatvarnalab, this)
  plasma.on("kill", this.kill, this)

  dna.interval = dna.interval || 5*60*1000
  if (!dna.disabled) {
    var self = this
    this.poolIntervalID = setInterval(function(){
      self.update()
    }, dna.interval)
    self.update()
    console.info('refreshing whois on ', dna.interval, 'seconds')
  }
}

module.exports.prototype.update = function(c, next) {
  if(this.updateInProgress)
    return next && next()
  var self = this
  this.updateInProgress = true
  this.fetchWhoisData(function (err, result) {
    if (err) {
      self.updateInProgress = false
      return console.error(err)
    }
    self.updateInProgress = false
    self.lastFetchTimestamp = new Date(result.timestamp * 1000)

    self.peopleOnline = result.active.map(function(data){
      return new Person(data)
    })
    next && next()
  })
}

module.exports.prototype.fetchWhoisData = function (next) {
  request.get({
    uri: 'https://json.varnalab.org/services/active.json',
    json: {}
  }, function (err, res, body) {
    if (err) return next(err)
    next(null, body)
  })
}

module.exports.prototype.whoisatvarnalab = function(c, next){
  var self = this
  next(null, {
    data: self.peopleOnline,
    timestamp: moment(self.lastFetchTimestamp).fromNow()
  })
}

module.exports.prototype.kill = function(c, next) {
  if(this.poolIntervalID)
    clearInterval(this.poolIntervalID)
  next()
}
