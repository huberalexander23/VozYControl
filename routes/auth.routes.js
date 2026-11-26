const router = require("express").Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { registrar, login, perfil, logout, iniciarSesion } = require("../controllers/auth.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Espera unos minutos e inténtalo nuevamente." }
});

router.post("/registro", loginLimiter, registrar);
router.post("/login", loginLimiter, login);
router.get("/perfil", verificarToken, perfil);
router.post("/logout", logout);

router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    return res.status(503).send("El inicio de sesión con Google todavía no está configurado.");
  }
  next();
}, passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login.html?error=google"
  }),
  (req, res) => {
    iniciarSesion(res, req.user);
    res.redirect("/panel.html?login=google");
  }
);

module.exports = router;
