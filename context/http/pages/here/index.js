var DHCPClient = require("../../../models/server/DHCPClient")

module.exports = function(plasma, dna, helpers){
  return {
    "GET": function(req, res){
      res.locals.currentMac = ""
      res.locals.currentAlias = ""
      res.sendPage("here/index")
    },
    "POST": function(req, res, next) {
      req.body.mac = req.body.mac.toUpperCase()
      DHCPClient.findOne({mac: req.body.mac}, function(err, client){
        if(err) return next(err)
        if(!client) client = new DHCPClient(req.body)
        client.alias = req.body.alias
        client.save(function(err){
          if(err) return next(err)
          res.redirect("/")
        })
      })
    }
  }
}
