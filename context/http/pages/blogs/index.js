module.exports = function(config){
  return {
    "GET /:pageNumber?": [this.blogsCount, this.getAllBlogs("pageNumber", 6), function(req, res){
      res.sendPage("blogs/index");
    }],
    "GET /:year/:month/:date/:slug": [this.getBlogPosts.byFullUrl, function(req, res) {
      req.disqus = config.disqus
      res.sendPage("blogs/blog");
    }]
  }
}
