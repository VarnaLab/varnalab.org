var helpers = require("../helpers")
var request = require("request")
var fs = require("fs")

describe("uploads", function(){

  it("boots", function(next){
    helpers.boot(next);
  })

  it("registers user", function(next){
    helpers.createUser(function(userData) {
      dummyUser = userData;
      next()
    })
  })

  it("should receive one file", function(next){
    var r = request.post({
      uri: helpers.apiendpoint+"/uploads"
    }, function(err, res, body){
      body = JSON.parse(body)
      expect(res.statusCode).toBe(200)
      expect(body.result).toBeDefined()
      expect(body.result).toBeArray()
      next()
    });
    var form = r.form();
    form.append("filename", fs.createReadStream(__dirname+"/../data/file.txt"));
  })

  it('kill', function (next){ 
    helpers.cleanUploads()
    helpers.kill(next);
  });
})