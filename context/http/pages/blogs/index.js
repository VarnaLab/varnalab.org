module.exports = function(){
  return {
    "GET /:pageNumber?": [this.blogsCount, this.getAllBlogs("pageNumber", 6), function(req, res){
      res.sendPage("blogs/index");
    }],
    "GET /:year/:month/:date/:slug": [this.getBlogPosts.byFullUrl, function(req, res) {      
      res.sendPage("blogs/blog");
    }]
  }
}