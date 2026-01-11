import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
},
// : Before the code User.findOne(...) ever runs, Passport automatically grabs that ?code=... from the URL and exchanges it for the profile (accessToken, refreshToken, profile)    
// This runs AFTER the code has been exchanged for the profile
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // 2. Check if user exists with this Email (Link accounts)
            const email = profile.emails[0].value;
            user = await User.findOne({ email });

            if (user) {
                // Update user with googleId so they can login with Google next time
                user.googleId = profile.id;
                // Optionally update avatar if they don't have one
                if (!user.avatar) {
                    user.avatar = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }

            // 3. Create new user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: email,
                avatar: profile.photos[0].value,
                // No password needed
            });

            return done(null, user);

        } catch (err) {
            console.error('Google Auth Error:', err);
            return done(err, null);
        }
    }
));

export default passport;
