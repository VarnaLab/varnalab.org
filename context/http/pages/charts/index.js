
var moment = require('moment');


module.exports = function(config){
  /*var User = require(config.models+"/User");
  var Spend = require(config.models+"/Spend");*/

  /*
   * Period
   */

  function getDateRangeGroupedByMember (from, to, cb) {
    User.aggregate({
      $unwind: '$income'
    }, {
      $match: {
        $and: [
          {'income.date': {$gte: new Date(from)}},
          {'income.date': {$lte: new Date(to)}}
        ]
      }
    }, {
      $group: {
        _id: '$name',
        cache: {$sum:'$income.cache'}
      }
    }, {
      $sort: {
        cache: -1
      }
    }, function (err, members) {
      if (err) return cb(err);
      cb(null, members);
    });
  }

  function getTotalCacheForDateRange (from, to, cb) {
    User.aggregate({
      $unwind: '$income'
    }, {
      $match: {
        $and: [
          {'income.date': {$gte: new Date(from)}},
          {'income.date': {$lte: new Date(to)}}
        ]
      }
    }, {
      $group: {
        _id: '$cache',
        cache: {$sum:'$income.cache'}
      }
    }, {
      $project: {
        _id: 0,
        total: '$cache'
      }
    }, function (err, total) {
      if (err) return cb(err);
      cb(null, total);
    });
  }

  function period (members, total) {
    var ratio = total[0].total / 100, // total / 100%
      data = [];
    for (var i=0; i < members.length; i++) {
      var percentage = members[i].cache / ratio;
      data.push({
        name: members[i]._id, 
        y: parseFloat(percentage.toFixed(2)),
        total: members[i].cache // adding custom data to the object
      });
    }
    return data;
  }

  /*
   * Months
   */

  function getTotalIncome (cb) {
    User.aggregate({
      $unwind: '$income'
    }, {
      $group: {
        _id: '',
        cache: {$sum:'$income.cache'}
      }
    }, function (err, sum) {
      if (err) return cb(err);
      cb(null, sum[0].cache);
    });
  }

  function getIncomeGroupedByMonth (cb) {
    User.aggregate({
      $unwind: '$income'
    }, {
      $group: {
        _id: '$income.date',
        cache: {$sum:'$income.cache'}
      }
    }, {
      $sort: {
        _id: 1
      }
    }, function (err, months) {
      if (err) return cb(err);
      cb(null, months);
    });
  }

  function getTotalSpend (cb) {
    Spend.aggregate({
      $unwind: '$spend'
    }, {
      $group: {
        _id: '',
        cache: {$sum:'$spend.cache'}
      }
    }, function (err, sum) {
      if (err) return cb(err);
      cb(null, sum[0].cache);
    });
  }

  function getSpendGroupedByMonth (cb) {
    Spend.aggregate({
      $unwind: '$spend'
    }, {
      $group: {
        _id: '$spend.date',
        cache: {$sum:'$spend.cache'}
      }
    }, {
      $sort: {
        _id: 1
      }
    }, function (err, months) {
      if (err) return cb(err);
      cb(null, months);
    });
  }

  function months (income, spend) {
    var months = [];
    var _income = [];
    for (var i=0; i < income.length; i++) {
      _income.push(income[i].cache);
    }
    var _spend = [];
    for (var i=0; i < spend.length; i++) {
      months.push(moment(spend[i]._id).format('YYYY-MM'));
      _spend.push(spend[i].cache);
    }
    return {
      months: months,
      series: [
        {name: 'Разходи', data: _spend},
        {name: 'Приходи', data: _income}
      ]
    };
  }

  /*
   * Ranglist
   */

  function getIncomeGroupedByMember (cb) {
    User.aggregate({
      $unwind: '$income'
    }, {
      $group: {
        _id: '$name',
        cache: {$sum:'$income.cache'}
      }
    }, {
      $sort: {
        cache: 1
      }
    }, function (err, members) {
      if (err) return cb(err);
      cb(null, members);
    });
  }

  function ranglist (members) {
    var series = [];
    for (var i=0; i < members.length; i++) {
      series.push({ // pushing object
        name: members[i]._id, 
        data: [members[i].cache]
      });
    }
    return series;
  }


  return {
    "GET": function(req, res){
      var from = moment().startOf('month').format('YYYY-MM-DD'),
        to = moment().endOf('month').format('YYYY-MM-DD');
      getDateRangeGroupedByMember(from, to, function (err, members) {
        getTotalCacheForDateRange(from, to, function (err, total) {
          req.data = {data:period(members, total), total:total};
          res.sendPage("charts/index");
        });
      });
    },
    "POST /period": function(req, res){
      var from = req.body.from,
        to = req.body.to;
      getDateRangeGroupedByMember(from, to, function (err, members) {
        getTotalCacheForDateRange(from, to, function (err, total) {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({data:period(members, total), total:total}));
        });
      });
    },
    "GET /months": function(req, res){
      getIncomeGroupedByMonth(function (err, income) {
        getTotalIncome(function (err, totalIncome) {
          getSpendGroupedByMonth(function (err, spend) {
            getTotalSpend(function (err, totalSpend) {
              res.writeHead(200, {'Content-Type': 'application/json'});
              var v = months(income, spend);
              res.end(JSON.stringify({
                data: {
                  months: v.months,
                  series: v.series,
                  totalIncome: totalIncome,
                  totalSpend: totalSpend
                }
              }));
            });
          });
        });
      });
    },
    "GET /ranglist": function(req, res){
      getIncomeGroupedByMember(function (err, members) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data:ranglist(members)}));
      });
    }
  }
}