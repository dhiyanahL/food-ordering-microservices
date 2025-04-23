const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../src/models/user');

// GOOGLE OAUTH STRATEGY
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOneAndUpdate(
            { googleId: profile.id },
            { name: profile.displayName, email: profile.emails[0].value },
            { upsert: true, new: true }
        );
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// FACEBOOK OAUTH STRATEGY
passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOneAndUpdate(
            { facebookId: profile.id },
            { name: profile.displayName, email: profile.emails[0].value },
            { upsert: true, new: true }
        );
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
