module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/transactions/create";
    else
      return "/api/transactions/"+this.model.id;
  }
})