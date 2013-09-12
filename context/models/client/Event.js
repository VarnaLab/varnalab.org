module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/events/add";
    else
      return "/api/events/"+this.id;
  }
})