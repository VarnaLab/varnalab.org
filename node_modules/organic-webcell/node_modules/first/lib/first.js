/*jshint eqeqeq:true, proto:true, laxcomma:true, undef:true, node:true, expr: true*/

var slice = Array.prototype.slice
  , isArray = require('util').isArray
  , push = Array.prototype.push
  , concat = Array.prototype.concat;

module.exports = function first (f) {
  var functions = [f], next = function () {
    var f = functions.shift(), p = [];

    if (!f) return;

    // if there more than one function to run in parallel
    if (isArray(f)) {
      var i = f.length
        , n = i
        , results = []
        // bucket creates a callback, that counts how often it was called
        // and will in turn fire a callback if a certain threshold is reached.
        // It also makes sure "results" (callback arguments) are kept in
        // order.
        , bucket = function (store) {
          
        return function () {
          results[store] = (slice.apply(arguments));
          if (!--n) {
            // thrshold was reached, call next!
            next.apply(this, results); 
          }
        };

      };

      while(i--) {
        // now run all functions simultaniously, giving them their respective
        // bucket and the arguments that where given to this call to next.
        f[i].apply(bucket(i), arguments);
      }

    } else {
      // if there's only one, simply run it, giving it next as this
      // and the arguments given to this call to next as arguments.
      f.apply(next, arguments);
    }
  };

  var deferred = {
    then: function() {
      push.apply(functions, arguments);
      return this;
    },
    whilst: function() {
      var last = functions.length-1;
      if (isArray (functions[last])) {
        push.apply(functions[last], arguments);
      } else {
        functions[last] = concat.apply([functions[last]], arguments);
      }
      return this;
    }
  };

  process.nextTick(next);

  return deferred;
};
