module.exports = function(plasma, dna, helpers){
  return {
    "* *": [
      helpers.pageHelpers,
      helpers.version,
      helpers.whoisatvarnalab(plasma),
      helpers.randomMember
    ], 
    "GET": [
      helpers.getBlogPosts.last(3),
      helpers.blogsCount,
      helpers.getUpcomingEvents,
      helpers.eventsCount,
      function(req, res) {
        res.sendPage("index");
      }
    ]
  }
}