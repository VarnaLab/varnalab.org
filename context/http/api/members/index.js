module.exports = function(config){
  var Member = require(config.models+"/Member");
  var _ = require('underscore');
  var accessToken;
  try {
   accessToken = require(process.cwd()+"/accesstoken.json").value
  } catch(e){
    // ignore
  }
  
  return {
    "GET": function(req, res){
      Member.find({}, function(err, members){
        if(err) return res.error(err);
        var publicMembers = _.map(members, function(mem){
          return mem.toPublicJSON();
        })
        res.result(publicMembers);
      })
    },
    "POST /register": function(req, res){
      if(req.body.accessToken != accessToken)
        return res.error("invalid accesstoken")
      Member.create(req.body, function(err, member){
        if(err) return res.error(err);
        req.logIn(member, function(err) {
          if (err) { return next(err); }
          return res.result(member);
        });
      })
    },
    "GET /me": function(req, res){
      Member.findById(req.session.passport.user, function(err, member){
        if(err) return res.error(err);
        res.result(member.toPublicJSON());
      });
    },
    "GET /logout": function(req, res, next) {
      req.logout();
      res.redirect("/");
    },
    "GET /:id": function(req, res){
      Member.findById(req.params.id, function(err, member){
        if(err) return res.error(err);
        res.result(member.toPublicJSON());
      });
    },
    "PUT /:id": function(req, res){
      Member.findById(req.params.id, function(err, member){
        if(err) return res.error(err);
        _.extend(member, req.body)
        member.save(function(err){
          if(err) return res.error(err);
          res.result(member.toPublicJSON())
        })

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
