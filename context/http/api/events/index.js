var _ = require('underscore');

module.exports = function(config){
  var Event = require(config.models+"/Event");
  return {
    "GET": function(req, res){
      Event.find({}, function(err, events){
        if(err) return res.error(err);
        res.result(events); 
      })
    },
    "POST /create": function(req, res){
      req.body.creator = req.session.passport.user;

      Event.create(req.body, function(err, event){
        if(err) return res.error(err);
        res.result(event);
      })
    },
    "GET /:id": function(req, res){
      Event.findOne(req.params.id, function(err, event){
        if(err) return res.error(err);
        res.result(event);
      });
    },
    "PUT /:id": function(req, res){
      var event = Event.findById(req.params.id, function(err, event){
        if(err) return res.error(err);
        _.extend(event,req.body);
        event.save(function(err, event){
          if(err) return res.error(err);
          res.result(event);
        }); 
      });
      
    },
    "DELETE /remove": function(req, res){
      //TODO validate input
      Event.findByIdAndRemove(req.params.id,req.body, function(err, event){
        if(err) return res.error(err);
        if(!event) return res.error("sorry dude");
        res.result(event);
      });
    }
  }
}