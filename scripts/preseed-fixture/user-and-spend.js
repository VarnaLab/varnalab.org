
var async = require("async");


exports.addUsers = function(incomeJSON, callback){
  var User = require("../../context/models/server/User");

  async.eachSeries(incomeJSON, function(member, next) {
    var income = [];
    for (var i=0; i < member.cache.length; i++) {
      income.push({
        cache: member.cache[i],
        date: new Date(member.dateString[i])
      });
    }

    User.create({
      name: member.memberName,
      income: income
    }, function (err) {
      next(err);
    });
  }, function(err){
    callback(err);
  });
}

exports.addSpend = function(spendJSON, callback){
  var Spend = require("../../context/models/server/Spend");

  async.eachSeries(spendJSON, function(item, next) {
    var spend = [];
    for (var i=0; i < item.cache.length; i++) {
      spend.push({
        cache: item.cache[i],
        date: new Date(item.dateString[i])
      });
    }

    Spend.create({
      name: item.expenseName,
      spend: spend
    }, function (err) {
      next(err);
    });
  }, function(err){
    callback(err);
  });
}
