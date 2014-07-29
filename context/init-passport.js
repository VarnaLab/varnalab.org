var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy;
var Member = require("./models/server/Member")

passport.use(new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  function(username, password, done) {
    Member.findOne({ email: username }, function (err, user) {
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
  Member.findById(id, function(err, user) {
    done(err, user);
  });
});