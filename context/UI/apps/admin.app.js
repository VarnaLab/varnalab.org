require("./boot");

var TransactionsView = require("views/admin/transactions")
var TransactionsCollection = require("models/client/TransactionsCollection");

var MembersView = require("views/admin/members")
var MembersCollection = require("models/client/MembersCollection")

var BlogPostsCollection = require("models/client/BlogpostsCollection")
var BlogPostsView = require("views/admin/blogposts")
var EditBlogPostView = require("views/admin/blogposts/edit")

$(function(){
  app = {}; // WARNING -> global variable

  var Router = Backbone.Router.extend({
    routes: {
      "": "showIndex",
      "transactions": "showTransactions",
      "members":"showMembers",
      "blogposts": "showBlogposts",
      "blogposts/edit/:id": "editBlogpost"
    },
    showIndex: function(){

    },
    showTransactions: function(){
      var collection = new TransactionsCollection();

      var view = new TransactionsView({
        collection: collection
      });
      
      collection.fetch().success(function(){
        $(".currentView").empty().append(view.render().$el)  
      })
    },
    showMembers: function(){
      var membersCollection = new MembersCollection();

      var view = new MembersView({
        collection:membersCollection
      });

      membersCollection.fetch().success(function(){
        $(".currentView").empty().append(view.render().$el);  
      }).error(function(err){
        alert(err);
      })
    },
    showBlogposts: function(){
      var collection = new BlogPostsCollection();

      var view = new BlogPostsView({
        collection: collection
      });

      collection.fetch().success(function(){
        $(".currentView").empty().append(view.render().$el);  
      }).error(function(err){
        alert(err);
      })
    },
    editBlogpost: function(id){
      var model = new BlogPostsCollection.prototype.model();
      model.id = id;
      var view = new EditBlogPostView({
        model: model
      });
      model.fetch({
        success: function(){
          $(".currentView").empty().append(view.render().$el);  
        },
        error: alert
      })
    }
  })
  app.router = new Router();
  Backbone.history.start(); // triggers routes
})