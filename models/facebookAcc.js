const mongoose = require('mongoose');
const Schema = mongoose.Schema

let userSchema = new Schema({
    username: String,
    password: String,
    facebookId: String,
    secrets: Array
})

module.exports = userSchema