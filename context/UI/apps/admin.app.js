require("./boot");

var TransactionsView = require("views/admin/transactions")
var TransactionsCollection = require("models/client/TransactionsCollection");

var MembersView = require("views/admin/members")
var MembersCollection = require("models/client/MembersCollection")

$(function(){
  app = {}; // WARNING -> global variable

  var Router = Backbone.Router.extend({
    routes: {
      "": "showIndex",
      "transactions": "showTransactions",
      "members":"showMembers"
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
    }
  })
  app.router = new Router();
  Backbone.history.start(); // triggers routes
})