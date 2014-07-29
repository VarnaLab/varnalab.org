module.exports = function(plasma, dna, helpers){
  return {
    "GET": [helpers.getAllEvents, helpers.eventsCount, function(req, res){
      req.eventsCount = req.events.length;
      res.sendPage("events/index");
    }],
    "GET /:year/:month/:date/:title": [helpers.getEvents.byFullUrl, function(req, res) {
      req.disqus = dna.disqus
      res.sendPage("events/event");
    }]
  }
}