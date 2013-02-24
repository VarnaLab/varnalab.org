var request = require("request");
var _ = require("underscore");

var peopleOnline = [{
  alias: "test testerov"
},{
  alias: "test testerov"
},{
  alias: "test testerov"
},{
  alias: "test testerov"
},{
  alias: "test testerov"
},{
  alias: "test testerov"
}];

var Person = module.exports.Person = function(data){
  _.extend(this, data);
}

var getOptions = {uri: "http://hq.varnalab.org/list.php", json:{}};
request.get(getOptions, function(err, res, body){
  if(err) return;
  peopleOnline = _.map(body, function(item){ return new Person(item); });
});

module.exports = function(req, res, next){
  req.whoisatvarnalab = peopleOnline;
  next();
}