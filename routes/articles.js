// all article routes
// change all app.____ to route._____
// remove /articles from the start of all routes
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const { articleSchema } = require('../schemas.js'); //Joi schema
const { isLoggedIn, validateArticle, isOwner } = require('../middleware'); // need to be logged in to post an article
// const ExpressError = require('../utils/ExpressError');
const Article = require('../models/articles');
const articles = require('../controllers/articles'); //article controller
const multer = require('multer'); //helps to parse multi-form data which is primarily used while uploading files
const { storage } = require('../cloudinary'); //don't need to do /index coz node automatically looks for an index.js file
const upload = multer({ storage });
var nl2br  = require('nl2br'); // to display paragraphs

router.route('/')
    .get(catchAsync(articles.index))
    .post(isLoggedIn, upload.array('image'), validateArticle, catchAsync(articles.createArticle))
    // upload.array is a middleware

router.get('/new', isLoggedIn, articles.renderNewForm)

router.route('/:id')
    .get(catchAsync(articles.showArticle))
    .put(isLoggedIn, isOwner, upload.array('image'), validateArticle, catchAsync(articles.updateArticle))
    .delete(isLoggedIn, isOwner, catchAsync(articles.deleteArticle))
    
router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(articles.renderEditForm))


// we don't want this to run on every single route; we want it to be selectively applied
// so we make it a middleware function and not app.use
// const validateArticle = (req, res, next) => {
//     // shift to a seperate file svhemas.js :
//     // const articleSchema = Joi.object({
//     //     article: Joi.object({
//     //         title: Joi.string().required(),
//     //         author: Joi.string().required(),
//     //         date: Joi.string().required(),
//     //         para: Joi.string().required()
//     //     }).required()
//     // })
//     // validate with req.body
//     const {error} = articleSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',') 
//         throw new ExpressError(msg, 400)
//     } else {
//         next(); // to make it to our actual route handler like app.post
//     }
// };

// const isOwner = async(req, res, next) => {
//     const {id} = req.params;
//     const art = await Article.findById(id);
//     if (!art.owner.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/articles/${art._id}`);
//     }
//     next(); // does have permission to change article
// }

// initial testing route for articles
// app.get('/articles', async(req, res) => {
//     const art = new Article({title: 'Magic!', para: 'Yohoo!'});
//     await art.save();
//     res.send(art);
// })

// router.get('/', catchAsync(async(req, res, next) => {
//     const art = await Article.find({});
//     res.render('articles/index', {art}); 
// }))
// router.get('/', catchAsync(articles.index))

// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('articles/new');
// })
// router.get('/new', isLoggedIn, articles.renderNewForm)

// Foder 43 video 3 error handling is not working
// need try and catch because mongoose might be giving error
// end point where form is submitted
// router.post('/articles', async(req, res, next) => {
//     try {
//         // we take req.body.article coz that is what we are saving it under
//         // (see the form)
//         // {"article":{"title":"fhdh","author":"hffj","date":"2355","para":"sdggfh"}} is req.body
//         const art = new Article(req.body.article);
//         await art.save();
//         res.redirect(`/articles/${art._id}`);
//     } catch(e) {
//         next(e);
//     }
// })
// router.post('/', isLoggedIn, validateArticle, catchAsync(async(req, res, next) => {
//     // we throw an ExpressError coz we are inside an Async function; catchAsync will then catch that error and hand it off to next which will hand it down to the error handler at the end of this page
//     // if(!req.body.article) throw new ExpressError('Invalid Article Data', 400);
//     // defining our basic schema; this is not a Mongoose schema
//     // this is going to validate our data before we even attempt to save it with mongoose
//     // we should move this out into a place where this logic is more reusable than putting it into our rouute handler by building a middleware
//     // const articleSchema = Joi.object({
//     //     article: Joi.object({
//     //         title: Joi.string().required(),
//     //         author: Joi.string().required(),
//     //         date: Joi.string().required(),
//     //         para: Joi.string().required()
//     //     }).required()
//     // })
//     // // const result = articleSchema.validate(req.body);
//     // // if(result.error) {
//     // //     throw new ExpressError(result.error.details, 400) //we are inside our Async function so we throw the error & it will be caught by router.use
//     // // }
//     // const {error} = articleSchema.validate(req.body);
//     // if (error) {
//     //     // details is an array of objects; but we could have more than 1 so we map over them and return a new  array/ single string that we join on a ',' into a new string
//     //     const msg = error.details.map(el => el.message).join(',') //join if there is more than 1 message in it
//     //     throw new ExpressError(msg, 400)
//     // }
//     const art = new Article(req.body.article);
//     art.owner = req.user._id;
//     await art.save();
//     req.flash('success', 'Article posted successfully!'); // we do this after saving coz we can be sure there were no errors
//     res.redirect(`/articles/${art._id}`);
// }))
// router.post('/', isLoggedIn, validateArticle, catchAsync(articles.createArticle))

// router.get('/:id', catchAsync(async(req, res, next) => {
//     const art = await Article.findById(req.params.id).populate('owner');
//     console.log(art);
//     if(!art) {
//         req.flash('error', 'Cannot find that article!');
//         return res.redirect('/articles'); // we return to avoid rendering articles/show
//     }
//     res.render('articles/show', {art});
// }))
// router.get('/:id', catchAsync(articles.showArticle))

// we want our isOwner validations to run after isLoggedIn
// router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async(req, res, next) => {
//     const {id} = req.params;
//     const art = await Article.findById(id);
//     if(!art) {
//         req.flash('error', 'Cannot find that article!');
//         return res.redirect('/articles'); // we return to avoid rendering articles/show
//     }
//     res.render('articles/edit', {art});
// }))
// router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(articles.renderEditForm))

// sending a real POST request which we are faking as a PUT request
// middleware validateArticle runs first and then the rest of it runs 
// router.put('/:id', isLoggedIn, isOwner, validateArticle, catchAsync(async(req, res, next) => {
//     // destructure the id
//     const {id} = req.params;
//     // const arti = await Article.findById(id);
//     // if (!art.owner.equals(req.user._id)) {
//     //     req.flash('error', 'You do not have permission to do that!');
//     //     return res.redirect(`/articles/${art._id}`);
//     // }
//     // using the spread operator to pass in updated stuff
//     // can't use this any longer coz we need to make sure that the person is authorized to update
//     const art = await Article.findByIdAndUpdate(id, {...req.body.article});
//     req.flash('success', 'Article updated successfully!');
//     res.redirect(`/articles/${art._id}`);
// }))
// we are making it to the PUT route with our POST request that we are faking out express into thinking or into treating it like it is a PUT request
// router.put('/:id', isLoggedIn, isOwner, validateArticle, catchAsync(articles.updateArticle))

// form will send POST request to URL but it's going to fake out Express into making it think its a DELETE requst because of method-override
// router.delete('/:id', isLoggedIn, isOwner, catchAsync(async(req, res, next) => {
//     const {id} = req.params;
//     await Article.findByIdAndDelete(id);
//     req.flash('success', 'Article deleted successfully!');
//     res.redirect(`/articles`);
// }))
// router.delete('/:id', isLoggedIn, isOwner, catchAsync(articles.deleteArticle))

module.exports = router;

// MVC - Model View Controller Frameworks