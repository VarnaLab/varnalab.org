describe("transactions", function(){
  var helpers = require("../helpers");
  var request = require("request");

  it("boots", function(next){
    helpers.boot(next);
  })

  var user = helpers.getValidMember();
  var transaction = helpers.getValidTransaction();

  it("creates new transaction", function(next){
    request.post({
      uri: helpers.apiendpoint+"/transactions/create",
      json: transaction
    }, function(err, res, body){
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      expect(transaction['id']).toBe == body.result._id
      next();
    })
  });

  it("lists all transactions", function(next){
    request.get({
      uri: helpers.apiendpoint+"/transactions",
      json: {}
    }, function(err, res, body){
      console.log(err);
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result).toBeArray();
      next();
    })
  });

  it("stops", function(){
    helpers.kill();
  });
})