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
  }
})