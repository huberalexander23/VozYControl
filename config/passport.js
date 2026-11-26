const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const Usuario = require("../models/Usuario");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = String(profile.emails?.[0]?.value || "").trim().toLowerCase();
      const emailVerified = profile._json?.email_verified === true;
      if (!email || !emailVerified) return done(null, false, { message: "Google debe proporcionar un correo verificado." });

      let usuario = await Usuario.findOne({ googleId: profile.id });
      if (!usuario) {
        usuario = await Usuario.findOne({ email });
        if (usuario) {
          usuario.googleId = profile.id;
          await usuario.save();
        } else {
          usuario = await Usuario.create({
            nombre: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            rol: "ciudadano"
          });
        }
      }
      return done(null, usuario);
    } catch (error) {
      if (error.code === 11000) return done(null, false, { message: "La cuenta ya se encuentra vinculada." });
      return done(error);
    }
  }));
}

module.exports = passport;
