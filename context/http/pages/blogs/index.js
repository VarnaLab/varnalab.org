module.exports = function(){
  return {
    "GET": [this.blogsCount, this.getAllBlogs, function(req, res){
      res.sendPage("blogs/index");
    }],
    "GET /:year/:month/:date/:slug": [this.getBlogPosts.byFullUrl, function(req, res) {      
      res.sendPage("blogs/blog");
    }]
  }
}