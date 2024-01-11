const passport = require('passport');
const local = require('passport-local').Strategy;
const User = require('../Models/User.model');

passport.use(
    new local({
        usernameField: "email",
        passwordField: "password"
    }, async(email, password, done)=>{
        try {
            const user = await User.findOne({email});
            if(!user){
                done(null, false, {message: 'You tried to login, Create an account Instead'});
                return;
            }
            const isMatch = await user.isValidPassword(password);
            return isMatch ? done(null, user) : done(null, false, {message: 'Incorrect Password'});
        } catch (error) {
            done(error);
        }
    })
);