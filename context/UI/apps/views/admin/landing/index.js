module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  render: function(){
    this.$el.html(this.template())
    if (window.location.toString().indexOf('fb_success') > -1) {
      alert('fb auth done')
    }
    return this;
  }
})
