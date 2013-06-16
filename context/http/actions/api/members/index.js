module.exports = function(config){
  var Member = require(config.models+"/Member");
  return {
    "GET": function(req, res){
      Member.find({}, function(err, members){
        res.result(members); 
      })
    },
    "POST /register": function(req, res){
      Member.create(req.body, function(err, member){
        if(err) return res.error(err);
        res.result(member);
      })
    },
    "GET /:id": function(req, res){
      Member.findOne(req.params.id, function(err, member){
        if(err) return res.error(err);
        res.result(member);
      });
    },
    "POST /login": function(req, res){
      Member.findOne(req.body, function(err, member){
        if(err) return res.error(err);
        res.result(member);
      });
    }
  }
}