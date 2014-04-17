module.exports = function(config, plasma){
  return {
    "* *": [
      this.version,
      this.whoisatvarnalab(plasma),
      this.randomMember,
      this.getFoursquareMayor
    ], 
    "GET": [
      this.getBlogPosts.last(3),
      this.blogsCount,
      this.getUpcomingEvents,
      this.eventsCount,
      function(req, res) {
        res.sendPage("index");
      }
    ]
  }
}