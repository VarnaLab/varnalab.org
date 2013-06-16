module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/members/register";
    else
      return "/api/members";
  }
})