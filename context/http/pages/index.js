module.exports = function(config){
  return {
    "* *": [
      this.version,
      this.whoisatvarnalab,
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