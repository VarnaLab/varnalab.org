var MemberModel = require("models/client/Member");
var MemberProfileView = require("./member/index.js")

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click .memberProfile": "showMember"
  },
  
  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    return this;
  },
  showMember: function(){
    var model = new MemberModel();
    var view = new MemberProfileView({
      model: model
    })
    $(".currentView").empty().append(view.render().$el) ;
  }
})