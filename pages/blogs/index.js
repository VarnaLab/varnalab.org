module.exports = function(){
  return {
    "GET": [this.getAllBlogs, function(req, res){
      res.sendPage();
    }],
    "GET /:blog": [this.getBlogByName("blog"), function(req, res) {      
      res.sendPage({}, __dirname+"/blog.jade");
    }]
  }
}