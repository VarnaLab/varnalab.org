var MemberModel = require("models/client/Member");
var helpers = require("views/helpers");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),

  events: {
    "click #submit": "update"
  },

  render: function(){
    this.$el.html(this.template({
      model:this.model
    }))
    return this;
  },
  update: function(e){
    e.preventDefault();
    this.model.save(helpers.extractFormData('#memberProfile'),{
      success: function(){
        alert('done')
      },
      error: helpers.handleError
    })
    return false;
  }
})
