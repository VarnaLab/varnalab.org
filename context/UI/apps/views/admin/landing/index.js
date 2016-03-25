var moment = require('moment')

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  render: function(){
    if (window.user.fbauth) {
      fbauthExpires = moment(window.user.fbauth.generated).add(window.user.fbauth.expires_in, "seconds").from(moment())
    } else {
      fbauthExpires = false
    }
    this.$el.html(this.template({
      user: window.user,
      fbauthExpires: fbauthExpires
    }))
    return this;
  }
})
