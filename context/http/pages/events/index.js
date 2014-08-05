module.exports = function(plasma, dna, helpers){
  return {
    "GET": [helpers.getAllEvents, helpers.eventsCount, function(req, res){
      res.locals.eventsCount = res.locals.events.length;
      res.sendPage("events/index");
    }],
    "GET /:year/:month/:date/:title": [helpers.getEvents.byFullUrl, function(req, res) {
      res.locals.disqus = dna.disqus
      res.sendPage("events/event");
    }]
  }
}