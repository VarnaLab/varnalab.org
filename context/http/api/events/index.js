var _ = require('underscore');

module.exports = function(plasma, dna, helpers){
  var Event = require(process.cwd()+dna.models+"/Event");
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
    }
  }
}