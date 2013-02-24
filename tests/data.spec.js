describe("static data module", function(){
  var data = require("../_data");
  it("returns last 3 blog posts", function(next){
    data.last3Blogs(function(blogs){
      expect(blogs.length).toBe(3);
      next();
    })
  })
});