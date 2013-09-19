module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click .js-newblogpost": "createNewBlogPost",
    "click .js-remove": "removeBlogPost",
    "click .js-edit": "editBlogPost"
  },

  initialize: function(){
    this.collection.on("destroy", this.render, this);
  },

  createNewBlogPost: function(){
    app.router.navigate("blogposts/create", true)
  },

  removeBlogPost: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id");
    if(confirm("Are you sure you want to delete blog post?")) {
      console.log(this.collection.get(id))
      this.collection.get(id).destroy();
    }
  },

  editBlogPost: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id")
    app.router.navigate("blogposts/edit/"+id, true);
  },
  
  render: function(){
    this.$el.html(this.template({
      collection: this.collection,
      moment: moment
    }))
    return this;
  }
})