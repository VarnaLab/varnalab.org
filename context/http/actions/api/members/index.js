module.exports = function(config){
  var Member = require(config.models+"/Member");
  return {
    "GET": function(req, res){
      Member.find({}, function(err, members){
        res.result(members); 
      })
    },
    "POST": function(req, res){
      Member.create(req.body, function(err, member){
        if(err) res.error(err);
        res.result(member);
      })
    },
    "GET /:id": function(req, res){
      Member.findOne(req.params.id, function(){

      });
    }
  }
}