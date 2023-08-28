// process.env.NODE_ENV is an environment variable whihc is usually development or production
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); //require the dotenv module and call the confid function
}
// allows us to access .env credentials in any file

// multer-storage-cloudinary helps upload the files that multer is parsing, to cloudinary. When we get back access to the URLs, multer adds them back

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //one of many engines used to run and parse and make sense of EJS
// const Joi = require('joi'); //for validations ; can remove it to coz we are using it in schemas.js
// const { articleSchema, discussionSchema } = require('./schemas.js');// destructure it coz we have multiple schemas in one file
// const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
// const Article = require('./models/articles'); can move these out into their respective router files
// const Page = require('./models/pages');
// const Discussion = require('./models/discussions');
const { executionAsyncId } = require('async_hooks');
const passport = require('passport');
const LocalStrategy= require('passport-local');
const User = require('./models/user'); //our user model
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const discussionRoutes = require('./routes/discussions')
var nl2br  = require('nl2br'); // to display paragraphs

// const nodemailer = require('nodemailer'); //for emails
// const test = require('./mails/test');

// Connecting to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/wondrous-world', 
{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery', false);
const db = mongoose.connection;
// Setting const db so that you won't have to write "mongoose.connection" everywhere
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

// Express is a function that needs to be called
const app = express();

// Telling express that ejs-mate is the engine we want to use instead of the default one which it is relying on
app.engine('ejs', ejsMate);

// Directly looks for code in views directory without having to specify the entire path all the time
app.set('view engine', 'ejs');
// Can run the code even from outside the stadiums folder from command prompt
app.set('views', path.join(__dirname, 'views'))

// The app.use() function is used to mount the specified middleware function(s) at the path which is being specified. It is mostly used to set up middleware for your application. 
// app.use runs on every single request
// app.use(path, callback)
// path: It is the path for which the middleware function is being called. It can be a string representing a path or path pattern or a regular expression pattern to match the paths.
// callback: It is a middleware function or a series/array of middleware functions.

// parse the body of the response sent via the form
// urlencoded returns a function
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public'))); // to allow us to serve our public directory

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // true is the default value anyway;If the HttpOnly flag (optional) is included in the HTTP response header, the cookie cannot be accessed through client side script. As a result, even if cross-site scripting (XSS) flaw exists, and a user accidentally a link that exploits this flaw, the browser (primarily Internet Explorer) will not reveal the cookie to a third party
        // Date.now() is in milliseconds
        // millisec sec min hours day => in a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // we set an expiration date to avoid a logged in user to stay logged in forever
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    // memory store is only for development purposes; once we deploy we will us a Mongo store
}
app.use(session(sessionConfig))
app.use(flash()); // to flash messages
// app.use(session(sessionConfig)) must be before app.use(passport.session())
app.use(passport.initialize());
app.use(passport.session()); // middleware to have persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // passport, use the localStrategy that we have downloaded and required; and for the localStrategy the authentication method is going to be located on the User model and it is called authenticate() (it is a static method added automataically by passport)
passport.serializeUser(User.serializeUser()); //tells passport how to serialize users and serialization refers to 'how do store a user in this session'
passport.deserializeUser(User.deserializeUser()); // how do we get an user out of this session => both these methods have been added in by our local plugin passport-local-mongoose

// // we don't want this to run on every single route; we want it to be selectively applied
// // so we make it a middleware function and not app.use
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

// declare middleware for flash before route handlers
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user; // from passport to check if logged in or not
    // the message contained might be empty too
    // we will have access to this automatically in our templates we don't have to pass it through
    // we take whatever's in success and have access to it in our res.locals under success
    res.locals.success = req.flash('success');
    // if there is anything stored in flash under the key of 'error'
    res.locals.error = req.flash('error');
    next();
})

// to check passport
// app.get('/fakeUser', async(req, res) => {
//     const user = new User({ email: 'fakemail@gmail.com', username: 'fakeName'});
//     const newUser = await User.register(user, 'fakePassword');
//     res.send(newUser);
// })

app.use('/', userRoutes)
app.use('/articles', articleRoutes);//use the articles route from router folder for routes which start with /articles
app.use('/:sec/:num/discussion', discussionRoutes);

// Going to the home page
app.get('/', (req, res) => {
    res.render('home');
})

//Going to the home page of paintings
// app.get('/paintings', (req, res) => {
//     res.render('paintings/paintings_home');
// })

app.get('/:sec', (req, res) => {
    const {sec} = req.params;
    res.render(`${sec}/${sec}_home`);
})

// app.get('/paintings/1', (req, res) => {res.render('paintings/1');})
// app.get('/paintings/:num', async(req, res) => {
//     const {num} = req.params;
//     res.render(`paintings/${num}`);
// })

app.get('/:sec/:num', async(req, res) => {
        const {sec, num} = req.params;
        res.render(`${sec}/${num}`);
    })

//Going to the home page of statues
// app.get('/statues', (req, res) => {
//     res.render('statues/statues_home');
// })

// app.get('/statues/1', (req, res) => {res.render('statues/1');})
// app.get('/statues/:num', async(req, res) => {
//     const {num} = req.params;
//     res.render(`statues/${num}`);
// })

// app.get('/paintings/:num/discussion', catchAsync(async(req, res) => {
//     const {num} = req.params;
//     const page = await Page.findOne({$and: [{section: 'paintings'}, {title: num}]}).populate('discussions');
//     res.render('discussion', { page });
// }))

// app.get('/makestadium', async (req, res) => {
//     const stadium = new Stadium({place: "Houston", date : "today", venue : "nrg", ss1 : "yohoo", ss2 : "nice"});
//     await stadium.save();
//     res.send(stadium);
// })

// all => for every single request
// * => for every path
// this will only run if nothing else is matched first
app.all('*', (req, res, next) => {
    // use ExpressError class
    next(new ExpressError('Page Not Found', 404))
    // passing error to next
})

// generic error handler
// err here stands for ExpressError or it might be some other error if it is coming from someplace else
app.use((err, req, res, next) => {
    // passing in defaults too
    // the default message will not work to update the error object coz we are giving the variable a default
    // const {statusCode = 500, message = 'Something Went Wrong'} = err;
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!';
    // res.status(statusCode).send(message); // sends back a status code
    res.status(statusCode).render('error', {err}) //render error.ejs in views
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})