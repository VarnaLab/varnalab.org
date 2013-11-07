module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/blogposts/add";
    else
      return "/api/blogposts/"+this.id;
  },
  getCreatorName: function(){
    if(this.get("creator"))
      return this.get("creator").name || this.get("creator").email
    else
      return "unknown"
  }
})
