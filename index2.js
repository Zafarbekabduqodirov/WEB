//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const encrypt = require('mongoose-encryption');
const MongoStore = require('connect-mongo'); // let router2 = require("./routes/post")
let OAuth2Strategy = require("oauth2-strategy")
var ClientOAuth2 = require('client-oauth2')




let Schema = mongoose.Schema;
let app = express();


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use(session({
    secret: "There is a text",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/example',
    passport.authenticate('oauth2'));

app.get('/auth/example/callback',
    passport.authenticate('oauth2', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// secret: 'secrettexthere',
//     saveUninitialized: true,
//     resave: true,
//     // using store session on MongoDB using express-session + connect
//     store: new MongoStore({
//         url: config.urlMongo,
//         collection: 'sessions'
//     }

mongoose.connect("mongodb://localhost:27017/Secrets", { useNewUrlParser: true })

let userSchema = require('./models/accModel');
userSchema.plugin(passportLocalMongoose)
let user = mongoose.model("user", userSchema)

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.listen(3000, () => {
    console.log("Hello world");
});

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register2", (req, res) => {
    res.render("register")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated) {
        res.render("secrets")
    } else {
        console.log("hayr");
        res.redirect("/login")
    }
})


app.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password;
    let newUser = new user({
        username,
        password
    });
    req.login(newUser, (err, docs) => {
        if (err) {
            console.log(err);
            console.log("error");
            res.redirect("/login")
        } else {
            console.log("uraaaaa1");
            passport.authenticate('local')(req, res, () => {
                console.log(req.user._id);
                res.redirect("/secrets")
            });
        }
    })
});
// {
//     successRedirect: '/secrets',
//     failureRedirect: '/register'
// },

app.post("/register", (req, res) => {
    // user.register(newUser, req.body.password, (err, docs) => {
    //     if (err) {
    //         console.log(err);
    //         console.log("error");
    //         res.redirect("/register2")
    //     } else {
    //         console.log("uraaaaa2");
    //         passport.authenticate('local')(req, res, () => {
    //             res.redirect("/secrets")
    //         });
    //     }
    // });
    user.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/register2')
        } else {
            passport.authenticate("local")(req, res, function() {
                console.log(req.user._id);
                res.redirect("/secrets")
            })
        }
    })
})