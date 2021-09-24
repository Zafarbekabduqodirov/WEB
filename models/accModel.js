const mongoose = require("mongoose")
const Schema = mongoose.Schema

let userSchema = new Schema({
    // name: String,
    // surname: String,
    // email: String,
    secrets: Array,
    username: String,
    password: String
})


module.exports = userSchema