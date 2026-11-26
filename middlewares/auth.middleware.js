const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

async function verificarToken(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, bearerToken] = authorization.split(" ");
  const token = req.cookies?.vozy_token || (scheme === "Bearer" ? bearerToken : null);

  if (!token) return res.status(401).json({ message: "Debes iniciar sesión." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "vozycontrol"
    });
    const usuario = await Usuario.findById(payload.sub).select("_id nombre email rol");
    if (!usuario) return res.status(401).json({ message: "La cuenta ya no está disponible." });
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.name === "TokenExpiredError" ? "Tu sesión expiró. Inicia sesión nuevamente." : "La sesión no es válida."
    });
  }
}

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ message: "Debes iniciar sesión." });
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
    next();
  };
}

module.exports = { verificarToken, permitirRoles };
