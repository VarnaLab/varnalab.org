describe("static data module", function(){
  var data = require("../_data");
  it("returns last 3 blog posts", function(next){
    data.last3Blogs(function(err, blogs){
      expect(blogs.length).toBe(3);
      next();
    })
  })
  it("reads blog by name", function(next){
    data.getBlogByName("Какво ново из лабърските среди", function(err, blog){
      expect(blog.title).toBe("Какво ново из лабърските среди");
      expect(blog.author).toBe("Kukov");
      next();
    })
  })
  it("returns upcoming events", function(next){
    data.upcomingEvents(function(err, events){
      expect(events.length).toBe(0);
      next();
    })
  })
  it("returns member by name", function(next){
    data.getMemberByName("Красимир Цонев", function(err, member){
      expect(member.name).toBe("Красимир Цонев");
      next();
    })
  })
});