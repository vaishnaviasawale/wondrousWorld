const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password); //will store hashed password and salt on our new user
        req.login(registeredUser, err => {
            if (err) return next(next); // hit the error handler
            req.flash('success', 'Welcome to the Wondrous World family!');
            res.redirect('/');
        }) // login a user after they have registered
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/'; // we redirect to where a user left us or to home page
    delete req.session.returnTo; // coz we don't want it to just sit in the session
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}