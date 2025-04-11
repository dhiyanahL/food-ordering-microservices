import dotenv from 'dotenv';
dotenv.config();


console.log('✅ Google Client ID:', process.env.GOOGLE_CLIENT_ID || 'Not loaded');
console.log('✅ Facebook Client ID:', process.env.FB_CLIENT_ID || 'Not loaded');


import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import User from '../src/models/user.js';

//GOOGLE OAUTH STRATEGY
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOneAndUpdate(
    { googleId: profile.id },
    { name: profile.displayName, email: profile.emails[0].value },
    { upsert: true, new: true }
  );
  return done(null, user);
}));

//FACEBOOK OAUTH STRATEGY
passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOneAndUpdate(
    { facebookId: profile.id },
    { name: profile.displayName, email: profile.emails[0].value },
    { upsert: true, new: true }
  );
  return done(null, user);
}));

