var MemberModel = require("models/client/Member");
var MemberProfileView = require("./member/index.js")

module.exports = Backbone.View.extend({
  template: require("./index.jade"),

  events: {
    "click .memberProfile": "editMember"
  },

  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    return this;
  },
  editMember: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id")
    app.router.navigate("members/edit/"+id, true);
  }
})
