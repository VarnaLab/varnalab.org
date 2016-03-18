require("./boot");
require("./vendor/jquery/fileupload")
require("./vendor/bootstrap/bootstrap-datetimepicker.min")

$(function(){
  app = {}; // WARNING -> global variable

  var IndexView = require("views/admin/landing")

  var TransactionsView = require("views/admin/transactions")
  var TransactionsCollection = require("models/client/TransactionsCollection");

  var MembersView = require("views/admin/members")
  var MembersCollection = require("models/client/MembersCollection")
  var MemberProfileView = require("views/admin/members/member/index.js")

  var BlogPostsCollection = require("models/client/BlogpostsCollection")
  var BlogPostsView = require("views/admin/blogposts")
  var EditBlogPostView = require("views/admin/blogposts/edit")

  var EventsCollection = require("models/client/EventsCollection")
  var EventsView = require("views/admin/events")
  var EditEventsView = require("views/admin/events/edit")

  var EpicEditor = require("./vendor/epiceditor");

  var Router = Backbone.Router.extend({
    routes: {
      "": "showIndex",
      "transactions": "showTransactions",
      "members":"showMembers",
      "members/edit/:id":"editMember",
      "blogposts": "showBlogposts",
      "blogposts/create": "createBlogpost",
      "blogposts/edit/:id": "editBlogpost",
      "events": "showEvents",
      "events/create": "createEvent",
      "events/edit/:id": "editEvent"
    },
    showIndex: function(){
      var view = new IndexView();
      $(".currentView").empty().append(view.render().$el)
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
    editMember: function(id){
      var model = new MembersCollection.prototype.model();
      model.id = id;
      var view = new MemberProfileView({
        model: model
      })

      model.fetch({
        success: function(){
          $(".currentView").empty().append(view.render().$el);
        },
        error: alert
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
    createBlogpost: function(){
      var model = new BlogPostsCollection.prototype.model();
      var view = new EditBlogPostView({
        model: model
      });
      $(".currentView").empty().append(view.render().$el);
      view.postRender();
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
          view.postRender();
        },
        error: alert
      })
    },
    showEvents: function(){
      var collection = new EventsCollection();

      var view = new EventsView({
        collection: collection
      });

      collection.fetch().success(function(){
        $(".currentView").empty().append(view.render().$el);
      }).error(function(err){
        alert(err);
      })
    },
    createEvent: function(){
      var model = new EventsCollection.prototype.model();
      var view = new EditEventsView({
        model: model
      });
      $(".currentView").empty().append(view.render().$el);
      view.postRender();
    },
    editEvent: function(id){
      var model = new EventsCollection.prototype.model();
      model.id = id;
      var view = new EditEventsView({
        model: model
      });
      model.fetch({
        success: function(){
          $(".currentView").empty().append(view.render().$el);
          view.postRender();
        },
        error: alert
      })
    }
  })

  app.router = new Router();
  Backbone.history.start(); // triggers routes
})
