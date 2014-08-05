module.exports = function(plasma, dna, helpers){
  return {
    "GET /:pageNumber?": [helpers.blogsCount, helpers.getAllBlogs("pageNumber", 6), function(req, res){
      res.sendPage("blogs/index");
    }],
    "GET /:year/:month/:date/:slug": [helpers.getBlogPosts.byFullUrl, function(req, res) {
      res.locals.disqus = dna.disqus
      res.sendPage("blogs/blog");
    }]
  }
}
