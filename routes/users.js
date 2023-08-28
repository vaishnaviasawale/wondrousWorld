const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users'); //user controller

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)

router.get('/logout', users.logout)

// router.get('/register', (req, res) => {
//     res.render('users/register');
// });
// router.get('/register', users.renderRegister);

// router.post('/register', catchAsync(async(req, res, next) => {
//     try {
//         const {email, username, password} = req.body;
//         const user = new User({email, username});
//         const registeredUser = await User.register(user, password); //will store hashed password and salt on our new user
//         req.login(registeredUser, err => {
//             if (err) return next(next); // hit the error handler
//             req.flash('success', 'Welcome to the Wondrous World family!');
//             res.redirect('/');
//         }) // login a user after they have registered
//     } catch(e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// }));
// router.post('/register', catchAsync(users.register));

// router.get('/login', (req, res) => {
//     res.render('users/login');
// })
// router.get('/login', users.renderLogin)

// passport gives us a middleware called passport.authenticate and it expects us to set a strategy (here: local)
// so we can have different routes to authenticate local and google
// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
//     req.flash('success', 'Welcome back!');
//     const redirectUrl = req.session.returnTo || '/'; // we redirect to where a user left us or to home page
//     delete req.session.returnTo; // coz we don't want it to just sit in the session
//     res.redirect(redirectUrl)
// })
// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)

// router.get('/logout', (req, res) => {
//     req.logout(function(err) {
//         if (err) { return next(err); }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/');
//     });
// })
// router.get('/logout', users.logout)

module.exports = router;