var _ = require('underscore');

module.exports = function(config){
  var Transaction = require(config.models+"/Transaction");
  return {
    "GET": function(req, res){
      Transaction.find({}, function(err, transactions){
        if(err) return res.error(err);
        res.result(transactions); 
      })
    },
    "POST /create": function(req, res){
      req.body.creator = req.session.userId;
      Transaction.create(req.body, function(err, transaction){
        if(err) return res.error(err);
        res.result(transaction);
      })
    },
    "GET /:id": function(req, res){
      Transaction.findOne(req.params.id, function(err, transaction){
        if(err) return res.error(err);
        res.result(transaction);
      });
    },
    "PUT /:id": function(req, res){
      var transaction = Transaction.findById(req.params.id, function(err, transaction){
        if(err) return res.error(err);
        _.extend(transaction,req.body);
        transaction.save(function(err, transaction){
          if(err) return res.error(err);
          res.result(transaction);
        }); 
      });
      
    },
    "DELETE /remove": function(req, res){
      Transaction.findByIdAndRemove(req.params.id,req.body, function(err, transaction){
        if(err) return res.error(err);
        if(!transaction) return res.error("sorry dude");
        res.result(transaction);
      });
    }
  }
}