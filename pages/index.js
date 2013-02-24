module.exports = function(config){
  return {
    "* *": this.version,
    "GET": [
      this.getLast3Blogs,
      this.blogsCount,
      this.getUpcomingEvents,
      this.eventsCount,
      function(req, res) {
        res.sendPage();
      }
    ]
  }
}