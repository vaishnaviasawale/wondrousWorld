// routes for all discussion related stuff
// prefix with /:sec/:num/discussion
const express = require('express');
const router = express.Router({mergeParams: true}); //so that req.params can be accessed; all the params from app.js are going to be merged alongside  these params 
const catchAsync = require('../utils/catchAsync');
// const { discussionSchema } = require('../schemas.js'); //Joi schema
const { isLoggedIn, validateDiscussion, isDiscussionOwner } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Page = require('../models/pages');
const Discussion = require('../models/discussions');
const discussions = require('../controllers/discussions'); //discussion controller

// const validateDiscussion = (req, res, next) => {
//     const {error} = discussionSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',') 
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// router.get('/', catchAsync(async(req, res) => {
//     // express router likes to keep params seperate
//     // so we don't have access to req.params like :sec :num in here
//     // so above while requiring set mergeParams to true
//     const {sec, num} = req.params;
//     const page = await Page.findOne({$and: [{section: sec}, {title: num}]}).populate({path: 'discussions', populate: {path: 'owner'}});
//     console.log(page);
//     res.render('discussion', { page });
// }))
router.get('/', catchAsync(discussions.showDiscussion))

// router.post('/', isLoggedIn, validateDiscussion, catchAsync(async(req, res) => {
//     const {sec, num} = req.params;
//     const page = await Page.findOne({$and: [{section: sec}, {title: num}]});
//     const discussion = new Discussion(req.body.discussion); // in discussion.ejs each input is given a name with prefix discussion; so it's all under the key of discussion once its been parsed
//     discussion.owner = req.user._id;
//     page.discussions.push(discussion); //push our new review 
//     await discussion.save(); //awaiting them in series instead of parallel but it doesn't matter coz these are very
//     await page.save(); // quick operations
//     req.flash('success', 'Comment posted successfully!');
//     res.redirect(`/${page.section}/${page.title}/discussion`);
// }))
router.post('/', isLoggedIn, validateDiscussion, catchAsync(discussions.createDiscussion))

// router.delete('/:discusid', isLoggedIn, isDiscussionOwner, catchAsync(async(req, res) => {
//     // even after deleting the comment we will stiff have its reference in our page so we have to find that and delete it too
//     // so we have to find that page and delete that 1 comment; it's an array with objectIDs
//     // we want to delete the one comment ID that corresponds to our comment
//     // we can use an operator in Mongo called $pull - it removes from an existing array all instances of a value or values that match a specified condition
//     const {sec, num, discusid} = req.params;
//     // first parameter - using num to find Page
//     // second parameter - passing an object to pull from the discussion array with that ID
//     await Page.findOneAndUpdate({$and: [{section: sec}, {title: num}]}, { $pull: {discussions: discusid} });
//     await Discussion.findByIdAndDelete(discusid);
//     req.flash('success', 'Comment deleted successfully!');
//     res.redirect(`/${sec}/${num}/discussion`);
// }))
router.delete('/:discusid', isLoggedIn, isDiscussionOwner, catchAsync(discussions.deleteDiscussion))

module.exports = router;