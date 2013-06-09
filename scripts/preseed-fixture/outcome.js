var async = require("async");

module.exports = function(spendJSON, callback){
  var Outcome = require("../../context/models/server/Outcome");
  var OutcomeTarget = require("../../context/models/server/OutcomeTarget");

  var spendsCount = spendJSON.length;

  spendJSON.forEach(function(data){
    OutcomeTarget.create({
      name: data.expenseName
    }, function(err, target){
      if(err) throw err;
      var i = -1;
      async.eachSeries(data.cache, function(value, next) {
        i += 1;
        Outcome.create({
          amount: data.cache[i],
          created: new Date(data.dateObject[i]),
          targetId: target
        }, function(err, outome){
          next(err);
        });
      }, function(err){
        if(err) throw err;
        spendsCount -= 1;
        if(spendsCount == 0) {
          callback();
        }
      });
    })
  });
}