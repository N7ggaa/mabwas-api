import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value, // Assuming email is always present
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, false);
    }
  }
));

// Apple OAuth Strategy (requires more setup on Apple's side)
// For Apple, you typically need to generate a private key and a client secret.
// This is a simplified example. Refer to Apple's documentation for full setup.
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY_LOCATION) {
  passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION, // Path to your .p8 key file
      callbackURL: `${process.env.FRONTEND_URL}/api/auth/apple/callback`,
      passReqToCallback: true // Allows access to req in callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Apple often returns user info in the `id_token` or `req.body.user`
        // This part might need adjustment based on how Apple returns data
        const appleId = profile.id; // Or from req.body.user.id
        const email = profile.email; // Or from req.body.user.email
        const username = profile.displayName; // Or from req.body.user.name
  
        let user = await User.findOne({ appleId: appleId });
  
        if (user) {
          return done(null, user);
        } else {
          user = await User.create({
            appleId: appleId,
            username: username || email.split('@')[0], // Fallback username
            email: email,
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  ));
}

// Passport session setup (not strictly needed for JWT, but good practice)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
