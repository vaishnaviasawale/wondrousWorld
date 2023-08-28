const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Contains the schema for all the pages which we need to make the discussion section
const PageSchema = new Schema({
    section: {
        type: String,
        required: true,
        enum: ['paintings', 'statues', 'monuments', 'literature', 'mythsandlegends', 'places'], 
    },
    title: {
        type: Number,
        required: true
    },
    // embed an array of objectIDs in each page
    // we could, theoretically, have thousands of comments on a single page
    // so we won't directly embed them in a single page; we will instead break them into their own model and just store their objectIDs on a page
    discussions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Discussion' //objectId from a Discussion model
        }
    ]
});

module.exports = mongoose.model('Page', PageSchema);
