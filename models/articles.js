const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// can only add virtual properties to a schema, but we want it on each image so that they can be resized

// Contains the schema
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// to control the size of the image in edit form
ImageSchema.virtual('thumbnail').get(function() {
    // this refers to particular image
    return this.url.replace('/upload', '/upload/w_200');
    // replace works on first match
})
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    profession: String,
    date: String,
    images: [ImageSchema], //nesting schemas
    para: {
        type: String,
        required: true
    },
    owner: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Article', ArticleSchema);

// module.exports = mongoose.model('Stadium' , StadiumSchema);
// "Stadium" begins with a capital letter

// images: [
//     {
//         url: String,
//         filename: String
//     }
// ],