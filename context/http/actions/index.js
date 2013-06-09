module.exports = function(config){
  return {
    "* *": [
      this.version,
      this.whoisatvarnalab,
      this.randomMember,
      this.getFoursquareMayor
    ], 
    "GET": [
      this.getLast3Blogs,
      this.blogsCount,
      this.getUpcomingEvents,
      this.eventsCount,
      function(req, res) {
        res.sendPage("index");
      }
    ]
  }
}