module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    
  },

  render: function(){
    this.$el.html(this.template({
      model: this.model
    }))
    return this;
  }
})