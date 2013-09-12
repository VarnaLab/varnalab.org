var MemberModel = require("models/client/Member");
module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    
  },
  
  render: function(){
    this.$el.html(this.template({
      
    }))
    return this;
  }
})