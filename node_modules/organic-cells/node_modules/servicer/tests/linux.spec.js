describe("linux services", function(){
  var linux;
  it("initializes", function(next){
    require("../lib/Linux").init(function(instance){
      linux = instance;
      next();
    })
  });
  it("installs", function(next){
    linux.install("testService", __dirname+"/data/app", "app.js", function(err){
      expect(err == null).toBe(true);
      next();
    });
  })
  it("starts", function(next){
    linux.start("testService", function(err){
      console.log(err);
      expect(err == null).toBe(true);
      next();
    });
  })
  it("stops", function(next){
    linux.stop("testService", function(err){
      console.log(err);
      expect(err == null).toBe(true);
      next();
    });
  })
  it("uninstalls", function(next){
    linux.uninstall("testService", function(err){
      expect(err == null).toBe(true);
      next();
    });
  })
})