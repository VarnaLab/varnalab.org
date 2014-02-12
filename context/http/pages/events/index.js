module.exports = function(config){
  return {
    "GET": [this.getAllEvents, this.eventsCount, function(req, res){
      req.eventsCount = req.events.length;
      res.sendPage("events/index");
    }],
    "GET /:year/:month/:date/:title": [this.getEvents.byFullUrl, function(req, res) {
      req.disqus = config.disqus
      res.sendPage("events/event");
    }]
  }
}