let express = require('express');
let bcrypt = require('bcrypt');
let passport = require('passport');
let passportLocal = require('passport-local');
let passportLocalMongoose = require('passport-local-mongoose');
let expressSession = require('express-session');
const ObjectId = require("mongodb").ObjectId
const mongoose = require("mongoose")
let userSchema = require('./../models/accModel');
let md5 = require('md5');
let user = mongoose.model("user", userSchema)
let router = express();

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


// router.post("/register", (req, res) => {
//     let name = req.body.name
//     let SurName = req.body.surname
//     let email = req.body.username
//     let password = bcrypt.hashSync(req.body.password, saltRounds);
//     let newUser = new user({ name, SurName, email, password, secrets: [] })
//     user.find({ email }, (err, docs) => {
//         if (err) console.log(err);
//         else {
//             if (docs.length === 0) {
//                 newUser.save();
//                 res.redirect(`/secrets/${newUser._id}`)
//             } else {
//                 res.redirect("/register2")
//             }
//         }
//     })
// })

router.post("/login", (req, res) => {
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
                passport.authenticate('local',
                    // {
                    //     successRedirect: '/secrets',
                    //     failureRedirect: '/register'
                    // },
                    (req, res) => {
                        res.redirect("/secrets")
                    });
            }
        })
        // user.findOne({ email }, (err, docs) => {
        //     if (err) console.log(err);
        //     else {
        //         if (!docs) return res.redirect("/login")
        //         let result = bcrypt.compareSync(password, docs.password)
        //         if (result) res.redirect(`/secrets/${docs._id}`)
        //         else res.redirect("/login")
        //     }
        // })
})

// router.post("/submit/:id", (req, res) => {
//     let _id = req.params.id;
//     let secret = req.body.secret;
//     user.findOne({ _id }, (err, docs) => {
//         if (err) console.log(err);
//         else {
//             let arr = docs.secrets
//             arr.push(secret)
//             user.updateOne({ _id }, { secrets: arr }, { acknowledge: true }, (err, docs2) => {
//                 if (err) console.log(err);
//                 // console.log(docs2);
//             })
//             res.redirect(`/secrets/${_id}`)
//         }
//     })
// })
router.post("/register", (req, res) => {
    user.register({ username: req.body.username }, req.body.password, (err, docs) => {
        if (err) {
            console.log(err);
            console.log("error");
            res.redirect("/register2")
        } else {
            console.log("uraaaaa2");
            res.redirect("/secrets");
            // passport.authenticate('local',
            //     // {
            //     //     successRedirect: '/secrets',
            //     //     failureRedirect: '/register'
            //     // },
            //     (req, res) => {
            //         res.redirect("/secrets")
            //     });
        }
    })
})


module.exports = router