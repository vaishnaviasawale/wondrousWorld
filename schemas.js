const Joi = require('joi');
// const articleSchema = Joi.object({
//     article: Joi.object({
//         title: Joi.string().required(),
//         author: Joi.string().required(),
//         para: Joi.string().required()
//     }).required()
// })
// our Joi schema which we need for validations
// we can also do email validations (+ min , max), credit card validations, custom ones, arrays in a particular order

// Article Validation
module.exports.articleSchema = Joi.object({
    article: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        profession: Joi.string().allow(null, ''),
        date: Joi.string().required(),
        // image: Joi.string().allow(null, ''),
        para: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

// For our comments on the discussion page
module.exports.discussionSchema = Joi.object({
    discussion: Joi.object({
        // currently likes is set to not required
        body: Joi.string().required(),
        likes: Joi.number()
    }).required()
});