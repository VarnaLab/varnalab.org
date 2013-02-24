module.exports = function(){
  return {
    "GET": [this.getAllEvents, this.eventsCount, function(req, res){
      req.eventsCount = req.events.length;
      res.sendPage();
    }]
  }
}