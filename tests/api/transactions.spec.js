describe("transactions", function(){
  var helpers = require("../helpers");
  var request = require("request");

  var user = helpers.getValidMember();
  var transaction = helpers.getValidTransaction();
  var createdTransaction;

  it("boots", function(next){
    helpers.boot(next);
  })

  it("creates new transaction", function(next){
    request.post({
      uri: helpers.apiendpoint+"/transactions/create",
      json: transaction
    }, function(err, res, body){
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      createdTransaction = body.result;
      next();
    })
  });

  it("lists all transactions", function(next){
    request.get({
      uri: helpers.apiendpoint+"/transactions",
      json: {}
    }, function(err, res, body){
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result).toBeArray();
      expect(body.result.length).toBe(1);
      next();
    })
  });

  it("updates transaction", function(next){
    request.put({
      uri: helpers.apiendpoint+"/transactions/"+createdTransaction._id,
      json: {
        amount: 2
      }
    }, function(err, res, body){
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result.amount).toBe(2);
      next();
    })
  });

  it("deletes transaction", function(next){
    request.del({
      uri: helpers.apiendpoint+"/transactions/"+createdTransaction._id,
      json: {}
    }, function(err, res, body){
      expect(body).toBeDefined();
      expect(body.result).toBeDefined();
      expect(body.result._id).toBe(createdTransaction._id);
      expect(body.result.amount).toBe(2);
      next();
    })
  });

  it('kill', function (next){ 
    helpers.kill(next);
  });
})