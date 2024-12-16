import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || "495669552891-lqepaofasv44npmbddf2fj4mloohjkoe.apps.googleusercontent.com",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);
  console.log("Profile:", profile);
  
  if (profile) {
    return done(null, profile);
  } else {
    return done(null, false, { message: 'No profile data' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
