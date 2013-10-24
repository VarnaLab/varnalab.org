module.exports = require("./MongoModel").extend({
  url: function(){
    if(this.isNew())
      return "/api/events/add";
    else
      return "/api/events/"+this.id;
  },
  parse: function(data){
    var result = data.result || data
    result.startDateTime = moment(result.startDateTime).toDate()
    result.endDateTime = moment(result.endDateTime).toDate()
    return require("./MongoModel").prototype.parse.call(this, data)
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
