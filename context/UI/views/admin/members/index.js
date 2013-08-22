var MemberModel = require("models/client/Member");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "submit .form": "submit"
  },
  
  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    return this;
  }
})