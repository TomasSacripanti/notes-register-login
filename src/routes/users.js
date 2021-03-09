const router = require('express').Router();
const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin.hbs');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', async (req, res) => {
    res.render('users/signup.hbs');
});

router.post('/users/signup', async (req, res) => {
    let { name, email, password, password2 } = req.body;
    const errors = [];
    if (name === '' || email === '' || password === '' || password2 === '') {
        errors.push({text: 'Fill in all fields'});
    } else {
        if (password.length < 8) {
            errors.push({text: 'Password must be at least 8 characters'});
        } else {
            if (password === password2) {
                const emailUser = await User.findOne({email: email});
                if (emailUser) {
                    req.flash('error_msg', 'The email is already in use');
                    res.redirect('/users/signup');
                }
                const newUser = new User({name, email, password});
                newUser.password = await newUser.encryptPassword(password);
                await newUser.save();
                req.flash('success_msg', 'You are registered');
                res.redirect('/users/signin');
            } else {
                errors.push({text: 'Password do not match'});
            }
        }
    }
    res.render('users/signup.hbs', {errors, name, email, password, password2});
});


router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;