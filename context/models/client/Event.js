module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/events/add";
    else
      return "/api/events/"+this.id;
  },
  validate: function(attrs) {
    if(moment(attrs.startDateTime).isAfter(attrs.endDateTime))
      return "end date is after start date"
  },
  getCreatorName: function(){
    if(this.get("creator"))
      return this.get("creator").name || this.get("creator").email
    else
      return "unknown"
  }
})
