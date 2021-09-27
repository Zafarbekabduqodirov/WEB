//jshint esversion:6
const express = require('express');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-find-or-create');
const session = require('express-session');
const encrypt = require('mongoose-encryption');
const router = require("./routes/router")
const userSchema = require('./models/accModel');
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("user", userSchema)
require('./auth');
require('./fbauth2');

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password == password) { return done(null, false); }
            return done(null, user);
        });
    }));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

let Schema = mongoose.Schema;
let app = express();


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use(session({
    secret: "There is a text",
    resave: false,
    saveUninitialized: false
}))
app.use(router)
app.use(passport.initialize())
app.use(passport.session())


let url = "mongodb://localhost:27017/Secrets"

let url2 = "mongodb+srv://Zafarbek:1303@its.46cyk.mongodb.net/SecretsDB"
mongoose.connect(url2, { useNewUrlParser: true, useUnifiedTopology: true })

app.listen(process.env.PORT || 3000, () => {
    console.log("Hello world");
})















// function isLoggedIn(req, res, next) {
//     console.log(req.user);

//     req.user ? next() : res.sendStatus(401);
// }
// // GET
// app.get("/", (req, res) => {
//     res.render("home")
// })

// app.get("/register", (req, res) => {
//     res.render("register")
// })

// app.get("/login", (req, res) => {
//     res.render("login")
// })


// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', {
//         successRedirect: '/secrets',
//         failureRedirect: '/auth/google/failure'
//     })
// );

// app.get("/auth/google/failure", (req, res) => {
//     res.send("No")
// })

// app.get("/secrets", (req, res) => {
//     if (req.isAuthenticated) {
//         console.log("salom");
//         console.log(req.user);
//         res.render("secrets", { secrets: req.user.secrets })
//     } else {
//         console.log("hayr");
//         res.redirect("/register")
//     }
// })



// app.get("/submit", isLoggedIn, (req, res) => {
//     res.render("submit")
// })

// app.post("/register", (req, res) => {
//     const username = req.body.username
//         // const name = req.body.name
//         // const surname = req.body.surname
//         // const email = req.body.email
//     User.register({
//         username,
//         secrets: []
//     }, req.body.password, (err, docs) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/register")
//         } else {
//             passport.authenticate('local')(req, res, () => {
//                 res.redirect("/secrets")
//             });
//         }
//     })
// })

// // name, surname, email, 

// app.post("/login", (req, res) => {
//     let username = req.body.username
//     let password = req.body.password;
//     let newUser = new User({ username, password });
//     req.login(newUser, (err, docs) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/login")
//         } else {
//             console.log("uraaaaa1");
//             passport.authenticate('local')(req, res, () => {
//                 res.redirect("/secrets")
//                 console.log(req.user);
//             });
//         }
//     })
// });

// app.post("/submit", isLoggedIn, (req, res) => {
//     let secret = req.body.secret;
//     let model;
//     if (req.user.googleId) {
//         model = google_user
//     } else {
//         model = User
//     }
//     console.log(model);
//     model.findOne({ id: req.user._id }, (err, docs) => {
//         if (err) console.log(err);
//         else {
//             let arr = docs.secrets
//             arr.push(secret)
//             model.updateOne({ id: req.user._id }, { secrets: arr }, { acknowledge: true }, (err2, docs2) => {
//                 if (err2) console.log(err2);
//             })
//             res.redirect(`/secrets`)
//         }
//     })
// })