var passport = require('passport'),
    compound;

exports.callback = function(token, tokenSecret, profile, done) {
    compound.models.User.findOrCreate({
        facebookId: profile.id,
        profile: profile,
        facebookToken: token
    }, function (err, user) {
        return done(err, user);
    });
};

exports.init = function (comp, conf) {
    compound = comp;
    var app = compound.app,
        Strategy = require('passport-facebook').Strategy;
    passport.use(new Strategy({
        clientID: conf.facebook.apiKey,
        clientSecret: conf.facebook.secret,
        callbackURL: conf.baseURL + 'auth/facebook/callback'
    }, exports.callback));

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: [ 'email', 'publish_stream', 'publish_checkins' ] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: conf.failureRedirect || '/'
        }), exports.redirectOnSuccess);

};
