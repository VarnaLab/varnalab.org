var path = require('path');
passport = require('passport');
console.warn("PASSPORT is Global");

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(config, httpServer) {
  var User = require(path.join(process.cwd(), config.model));

  passport.use(new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  httpServer.app.use(passport.initialize());
  httpServer.app.use(passport.session());
}