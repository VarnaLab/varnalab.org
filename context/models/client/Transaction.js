module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/transactions/create";
    else
      return "/api/transactions/"+this.id;
  },
  validate: function(attrs){
    var error = {};
    if(!attrs.from) error.from = "missing";
    if(!attrs.to) error.to = "missing"
    if(!_.isEmpty(error))
      return error;
  }
})
