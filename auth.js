require("dotenv").config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')

const userSchema = require("./models/googleAcc")

userSchema.plugin(findOrCreate)

let user = mongoose.model("google-user", userSchema)

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
    },
    function(request, accessToken, refreshToken, profile, cb) {
        user.findOrCreate({ googleId: profile.id }, function(err, user) {
            console.log(user);
            return cb(err, user);
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});