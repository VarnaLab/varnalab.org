module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click .js-create": "create",
    "click .js-remove": "remove",
    "click .js-edit": "edit"
  },

  initialize: function(){
    this.collection.on("destroy", this.render, this);
  },

  create: function(){
    app.router.navigate("events/create", true)
  },

  remove: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id");
    if(confirm("Are you sure you want to delete event?"))
      this.collection.get(id).destroy();
  },

  edit: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id")
    app.router.navigate("events/edit/"+id, true);
  },
  
  render: function(){
    this.$el.html(this.template({
      collection: this.collection,
      moment: moment
    }))
    return this;
  }
})