require("dotenv").config()
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')

const userSchema = require("./models/facebookAcc")

userSchema.plugin(findOrCreate)

let User = mongoose.model("facebook-user", userSchema)

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ facebookId: profile.id }, function(err, user) {
        console.log(profile);
        return cb(profile);
        // });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});