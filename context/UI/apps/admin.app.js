require("./boot");

var TransactionsView = require("views/admin/transactions")
var TransactionsCollection = require("models/client/TransactionsCollection");

$(function(){
  app = {}; // WARNING -> global variable

  var Router = Backbone.Router.extend({
    routes: {
      "": "showIndex",
      "transactions": "showTransactions"
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
    }
  })
  app.router = new Router();
  Backbone.history.start(); // triggers routes
})