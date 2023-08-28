const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// user schema - email, username, password
// don't specify username and password over here
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true //not exactly a validation, it sets up an index; not considered in a validation middleware
    }
});

// adds on username and password to our schema
// it makes sure the usernames are unique
// also gives us some additional methods to use
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// FOLDER 54 LAST VIDEO TO DISPLAY PROFILE IMAGES