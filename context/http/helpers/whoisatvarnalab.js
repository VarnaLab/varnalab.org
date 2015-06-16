var _ = require("underscore")
var DHCPClient = require("../../models/server/DHCPClient")

/*
  Populates res.local.whoisatvarnalab with Object : {
    data: Array [ { 
      mac: Stirng
      ip: String
      alias: String || Undefined
      host: String
    } ],
    timestamp: String
  }
*/
module.exports = function(plasma) {
  return function(req, res, next){
    plasma.emit("whoisatvarnalab", function(err, result){
      if(err) return next(err)
      
      DHCPClient.find({}, function(err, aliases){
        
        result.data = result.data.map(function(connectedPerson){
          var found = _.findWhere(aliases, {mac: connectedPerson.mac})
          if(found)
            found = found.toJSON()
          return _.extend({}, connectedPerson, found)
        })

        res.locals.whoisatvarnalab = result
        next();  
      })
    })
  }
}