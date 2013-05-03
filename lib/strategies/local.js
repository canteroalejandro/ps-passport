var passport = require('passport'),
    compound;

exports.callback = function (email, password, done) { 
    var User = compound.models.User;
    exports.User.findOne({where: {email: email} 
    }, function (err, user) {        
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(err, false);
        }
        if (!User.verifyPassword(password, user.password)) {
            return done(err, false);
        }
        return done(err, user);
    });
};

exports.init = function (comp, conf) {
    compound = comp;

    var app = compound.app,
        Strategy = require('passport-local').Strategy;
    passport.use(new Strategy({
        usernameField: conf.usernameField || 'email'
    }, exports.callback));

    app.post(conf.loginURI || '/login', passport.authenticate('local', {
        failureRedirect: conf.loginURI || '/login',
        failureFlash: true
    }), exports.redirectOnSuccess);

};

