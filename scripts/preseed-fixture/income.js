var async = require("async");

module.exports = function(incomeJSON, callback){
  var Member = require("../../context/models/server/Member");
  var Income = require("../../context/models/server/Income");

  var membersCount = incomeJSON.length;

  incomeJSON.forEach(function(memberData){
    Member.create({
      fullname: memberData.memberName
    }, function(err, member){
      if(err) throw err;
      var i = -1;
      async.eachSeries(memberData.cache, function(value, next) {
        i += 1;
        Income.create({
          amount: memberData.cache[i],
          created: new Date(memberData.dateObject[i]),
          memberId: member
        }, function(err, income){
          next(err);
        });
      }, function(err){
        if(err) throw err;
        membersCount -= 1;
        if(membersCount == 0) {
          callback();
        }
      });
    })
  });
}