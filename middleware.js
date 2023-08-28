const { articleSchema, discussionSchema } = require('./schemas.js'); 
const ExpressError = require('./utils/ExpressError');
const Article = require('./models/articles');
const Discussion = require('./models/discussions');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user); // req.user is from Passport and it is automatically filled in with the deserialized information from the session; so the session stores the serialized information and passport is going to deserialize/ unserialize and fill in req.user with that data
    // if not signed in; it equals to undefined
    // if signed in, it refers to id, username, email
    // passport method isAuthenticated()
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // we will redirect the user back to this Url
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login'); //return to avoid res.render('articles/new') from running
    } else {
        next();
    }
}

// req.path is /new coz that is in the GET request
// req.originalUrl is /articles/new => so this is the original one (the redirected path)


// from article routes
module.exports.validateArticle = (req, res, next) => {
    const {error} = articleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400)
    } else {
        next(); // to make it to our actual route handler like app.post
    }
};

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    const art = await Article.findById(id);
    if (!art.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/articles/${art._id}`);
    }
    next(); // does have permission to change article
}

module.exports.isDiscussionOwner = async(req, res, next) => {
    const {sec, num, discusid} = req.params; // see in the delete route it is /discusid
    console.log(sec, num);
    const discussion = await Discussion.findById(discusid);
    if (!discussion.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/${sec}/${num}/discussion`);
    }
    next();
}

module.exports.validateDiscussion = (req, res, next) => {
    const {error} = discussionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
