module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click .js-newblogpost": "createNewBlogPost"
  },

  createNewBlogPost: function(){
    var blogpost = new this.collection.model();
    blogpost.save({title: "new blog post", content: "blogpost body"}, {
      success: function(){
        app.router.navigate("blogposts/edit/"+blogpost.id, true);
      },
      error: alert
    })
  },
  
  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    return this;
  }
})