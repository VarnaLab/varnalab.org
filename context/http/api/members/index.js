module.exports = function(config){
  var Member = require(config.models+"/Member");
  return {
    "GET": function(req, res){
      Member.find({}, function(err, members){
        if(err) return res.error(err);
        res.result(members); 
      })
    },
    "POST /register": function(req, res){
      Member.create(req.body, function(err, member){
        if(err) return res.error(err);
        req.session.userId = member._id;
        res.result(member);
      })
    },
    "GET /:id": function(req, res){
      Member.findOne(req.params.id, function(err, member){
        if(err) return res.error(err);
        res.result(member);
      });
    },
    "POST /login": function(req, res, next) {
      passport.authenticate('local', function(err, user, info){
        if (err) { return next(err); }
        if (!user) { return res.error(info); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.result(user);
        });
      })(req, res, next)
    }
  }
}