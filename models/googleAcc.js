const mongoose = require('mongoose');
const Schema = mongoose.Schema

let userSchema = new Schema({
    username: String,
    password: String,
    googleId: String,
    secrets: Array
})

module.exports = userSchema