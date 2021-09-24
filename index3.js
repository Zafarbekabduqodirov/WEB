//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require("bcrypt")
const passport = require("passport")
const passportLocal = require("passport-local")
const passportMongoose = require("passport-local-mongoose")
const session = require("express-session")

let currentAccount = undefined
let hashCount = 10

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: "There is a text",
    resave: false,
    saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/Secrets", { useNewUrlParser: true })


const userSchema = require("./models/accModel").userSchema
userSchema.plugin(passportMongoose)
const UserModel = new mongoose.model("user", userSchema)

passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.listen(4000, function() {
    console.log("Server is working")
})

app.get("/", function(req, res) {
    res.redirect("/home")
})

app.get("/home", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register")
})


app.get('/logout', function(req, res) {
    res.redirect("/login")
})


app.get("/submit", function(req, res) {
    if (currentAccount != undefined) {
        res.render("submit")
    } else {
        res.redirect("/login")
    }
})

app.post("/submit", async function(req, res) {
    let secret = req.body.secret
    currentAccount.secrets.push(secret)

    let filter = {
        name: currentAccount.name,
        surname: currentAccount.surname,
        email: currentAccount.email,
        password: currentAccount.password
    }

    let updateFilter = { secrets: currentAccount.secrets }

    await UserModel.updateOne(filter, updateFilter)
    res.render("secrets", { secrets: currentAccount.secrets })
})



app.post("/register", function(req, res) {
    UserModel.register({
        username: req.body.username,
        // email: req.body.email,
        // name: req.body.name,
        // surname: req.body.surname,
        password: req.body.password,
        secrets: []
    }, req.body.password, function(error, user) {
        if (error) {
            console.log(error)
            res.redirect("/register")
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })
})


app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets")
    } else {
        console.log("uraaaaa1");
        res.redirect("/login")
    }
})


app.post("/login", function(req, res) {
    let user = new UserModel({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })
})