module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/blogposts/add";
    else
      return "/api/blogposts/"+this.id;
  },
  getCreatorName: function(){
    if(this.get("originalAuthor"))
      return this.get("originalAuthor")
    
    if(this.get("creator") && this.get("creator").name)
      return this.get("creator").name
    else
      return "unknown"
  }
})
