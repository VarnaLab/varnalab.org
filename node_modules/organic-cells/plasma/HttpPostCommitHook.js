var Organel = require("organic").Organel;

module.exports = Organel.extend(function HttpPostCommitHook(plasma, config){
  Organel.call(this, plasma, config);
  
  this.config = config || {};
  this.config.postCommitUrl = this.config.postCommitUrl || "/post-commit";
  this.config.traggerChemical = this.config.traggerChemical || {type: "Self", action: "upgrade"};
  
  var self = this;
  this.on("HttpPostCommitHook", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });

  this.on("HttpServer", function(c){
    if(this.config.log)
      console.log("post-commit-hook", this.config.postCommitUrl);

    c.data.app.post(this.config.postCommitUrl, function(req, res, next){
      if(req.body) {
        self.processPostCommit({req: req.body}, self);
        res.send({success: true});
      } else {
        var buffer = "";
        req.on('data', function(data){
          buffer += data.toString();
        })
        req.on('end', function(){
          req.body = buffer;
          self.processPostCommit({req: req.body}, self);
          res.send({success: true});
        })
      }
    });
    
    return false;
  })
}, {
  "processPostCommit": function(c, sender, callback) {
    if(this.config.triggerOn) {
      if(c.req.payload) {
        try {
          c.req = JSON.parse(c.req.payload)
        } catch(e){ }
      }
      if(c.req.ref && c.req.ref.indexOf(this.config.triggerOn) !== -1)
        this.emit(this.config.traggerChemical, callback);
    } else
      this.emit({type: "Self", action: "upgrade"}, callback);
  }
});