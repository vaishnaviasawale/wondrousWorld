const mongoose = require('mongoose');
const Schema = mongoose.Schema; // just to abbreviate some code

// discussion schema
const discussionSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        // required: true,
        default: 0,
        min: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Discussion", discussionSchema);

// connecting multiple discussions with 1 page
// one to many schema