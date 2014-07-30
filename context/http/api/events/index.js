var _ = require('underscore');
var Purest = require("purest")


module.exports = function(plasma, dna, helpers){
  var Event = require(process.cwd()+dna.models+"/Event");

  var facebookProvider = new Purest({
    provider: "facebook"
  })

  var twitterProvider = new Purest({
    provider: "twitter",
    key: dna.grant.credentials.twitter.key,
    secret: dna.grant.credentials.twitter.secret
  })


  var postInFacebook = function(event, token, done) {
    facebookProvider.post('214440281946231/feed', {
      qs:{
        access_token: token
      },
      form: {
        message: 'Publish test message on ' + new Date()
      }
    }, function (err, res, body) {
      if(res.statusCode != 200) {
        console.error("fb", body, token)
        return done(body)
      }
      done(err)
    });
  }

  var postInTwitter = function(event, token, secret, done) {
    twitterProvider.post('statuses/update', {
      oauth:{
        token: token, 
        secret: secret
      },
      data:{
        status: 'Test message on '+new Date()
      }
    },
    function (err, res, body) {
      if(res.statusCode != 200) {
        console.error("twitter", body)
        return done(body)
      }
      done(err)
    });
  }

  var broadcastEvent = function(event, options, done){
    postInFacebook(event, options.fb.token, function(err){
      if(err) return done(err)
      postInTwitter(event, 
        options.twitter.token, 
        options.twitter.secret, 
        done)
    })
  }

  var createOptions = function(req) {
    return {
      fb: { token: req.session.fb.code },
      twitter: { 
        token: req.session.twitter.oauth_token,
        secret: req.session.twitter.oauth_verifier
      }
    }
  }

  return {
    "GET": function(req, res){
      Event.find({}).populate("creator").exec(function(err, events){
        if(err) return res.error(err);
        res.result(events); 
      })
    },
    "POST /add": function(req, res){
      req.body.creator = req.user;
      Event.create(req.body, function(err, event){
        if(err) return res.error(err);
        res.result(event);
      })
    },
    "GET /:id": function(req, res){
      Event.findById(req.params.id).populate("creator").exec(function(err, event){
        if(err) return res.error(err);
        res.result(event);
      });
    },
    "PUT /:id": function(req, res){
      Event.findById(req.params.id).populate("creator").exec(function(err, event){
        if(err) return res.error(err);
        _.extend(event,req.body);
        event.save(function(err, event){
          if(err) return res.error(err);
          res.result(event);
        }); 
      });
    },
    "DELETE /:id": function(req, res){
      Event.findByIdAndRemove(req.params.id, function(err, event){
        if(err) return res.error(err);
        res.result(event);
      });
    },
    "GET /:id/post/:target": function(req, res) {
      Event.findById(req.params.id, function(err, event){
        if(err || !event) return res.error(err || "event not found")
        switch(req.params.target) {
          case "all": 
            req.session.target = req.params.target
            req.session.eventId = req.params.id
            res.redirect("/connect/facebook")
          break;
          case "facebook-page": 
            req.session.target = req.params.target
            req.session.eventId = req.params.id
            res.redirect("/connect/facebook")
          break;
          case "twitter": 
            req.session.target = req.params.target
            req.session.eventId = req.params.id
            res.redirect("/connect/twitter")
          break;
          default: 
            return res.error("target not found")
        }
      })
    },
    "GET /post/callback": function(req, res) {
      var redirectToDonePage = function(err){
        if(err) return res.error(err)
        res.redirect("/admin#events/edit/"+req.session.eventId+"?post=done")
      }
      Event.findById(req.session.eventId, function(err, event){
        if(err) return res.error(err)
        if(req.session.target == "all") {
          if(!req.session.fb) {
            // step 1 complete, fb access token retrieved
            req.session.fb = req.query
            console.log(req.query)
            return res.redirect("/connect/twitter")
          } else
          if(!req.session.twitter) {
            // step 1 & 2 complete, fb & twitter access token retrieved
            req.session.twitter = req.query
            return broadcastEvent(event, createOptions(req), 
              redirectToDonePage)
          } else {
            // step 1 & 2 already completed before
            return broadcastEvent(event, createOptions(req), 
              redirectToDonePage)
          }
        } else {
          // only twitter or fb posting
          if(req.session.target == "facebook-page")
            postInFacebook(event, 
              req.session.fb.code, 
              redirectToDonePage)
          else
          if(req.session.target == "twitter")
            postInTwitter(event, 
              req.session.twitter.oauth_token, 
              req.session.twitter.oauth_verifier, 
              redirectToDonePage)
        }
      })
    }
  }
}