const jwt = require("jsonwebtoken");

function generarToken(usuario) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no está configurado.");
  return jwt.sign(
    { sub: usuario._id.toString(), rol: usuario.rol },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN || "1h", issuer: "vozycontrol" }
  );
}

module.exports = { generarToken };
