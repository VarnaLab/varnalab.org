module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/blogposts/add";
    else
      return "/api/blogposts/"+this.id;
  }
})