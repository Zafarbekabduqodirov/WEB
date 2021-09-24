let express = require('express');
let bcrypt = require('bcrypt');
let passport = require('passport');
let passportLocal = require('passport-local');
let passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');
const ObjectId = require("mongodb").ObjectId
const mongoose = require("mongoose")
let router = express();

router.use(session({
    secret: "There is a text",
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())

const findOrCreate = require('mongoose-find-or-create');

let userSchema = require('./../models/accModel');
const userSchema2 = require("./../models/googleAcc")
const userSchema3 = require("./../models/facebookAcc")
userSchema.plugin(passportLocalMongoose)
userSchema2.plugin(passportLocalMongoose)
userSchema3.plugin(passportLocalMongoose)
let User = mongoose.model("user", userSchema)
let google_user = mongoose.model("google-user", userSchema2)
let facebook_user = mongoose.model("facebook-user", userSchema3)

function isLoggedIn(req, res, next) {
    console.log(req.user);
    req.user ? next() : res.sendStatus(401);
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            // if (user.password == password) { return done(null, false); }
            return done(null, user);
        });
    }
));

// GET
router.get("/", (req, res) => {
    res.render("home")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/login", (req, res) => {
    res.render("login")
})


router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    });


router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/secrets',
        failureRedirect: '/auth/google/failure'
    })
);

router.get("/auth/google/failure", (req, res) => {
    res.send("No")
})

router.get("/secrets", (req, res) => {
    if (req.isAuthenticated) {
        console.log("salom");
        console.log(req.user);
        res.render("secrets", { secrets: req.user.secrets })
    } else {
        console.log("hayr");
        res.redirect("/register")
    }
})



router.get("/submit", isLoggedIn, (req, res) => {
    res.render("submit")
})

router.post("/register", (req, res) => {
    const username = req.body.username
    const name = req.body.name
    const surname = req.body.surname
    const email = req.body.email
    let newUser = new user({ username, name, surname, email, secrets: [] });
    User.register(newUser, req.body.password, (err, docs) => {
        if (err) {
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect("/secrets")
            });
        }
    })
})

router.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password;
    let newUser = new User({ username, password });
    req.login(newUser, (err, docs) => {
        if (err) {
            console.log(err);
            res.redirect("/login")
        } else {
            console.log("uraaaaa1");
            passport.authenticate('local')(req, res, () => {
                res.redirect("/secrets")
                console.log(req.user);
            });
        }
    })
});

router.post("/submit", isLoggedIn, (req, res) => {
    let secret = req.body.secret;
    let model;
    if (req.user.googleId) {
        model = google_user
    } else if (req.user.facebookId) {
        model = facebook_user
    } else {
        model = User
    }
    console.log(model);
    model.findOne({ id: req.user._id }, (err, docs) => {
        if (err) console.log(err);
        else {
            let arr = docs.secrets
            arr.push(secret)
            model.updateOne({ id: req.user._id }, { secrets: arr }, { acknowledge: true }, (err2, docs2) => {
                if (err2) console.log(err2);
            })
            res.redirect(`/secrets`)
        }
    })
})


module.exports = router