// src/utils/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy({
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error("No email from Google"), null);

        let user = await User.findOne({ email });

        if (!user) {
          // new user, create a jobSeeker account by default
          const username = email.split("@")[0].toLowerCase();
          user = await User.create({
            email,
            username,
            // our schema needs a password, so generate a random strong one for oauth users
            password: Math.random().toString(36).slice(-16) + "Aa1!",
            role: "jobSeeker",
            googleId: profile.id,
            userProfile: {
              name: profile.displayName,
              profilePicture: profile.photos?.[0]?.value || "",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;