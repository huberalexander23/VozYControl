const Usuario = require("../models/Usuario");
const { generarToken } = require("../utils/jwt");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.APP_URL?.startsWith("https://") || process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
  maxAge: 60 * 60 * 1000
};

function usuarioPublico(usuario) {
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };
}

function iniciarSesion(res, usuario) {
  const token = generarToken(usuario);
  res.cookie("vozy_token", token, cookieOptions);
}

async function registrar(req, res, next) {
  try {
    const nombre = String(req.body.nombre || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!nombre || nombre.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) {
      return res.status(400).json({ message: "Ingresa un nombre y un correo electrónico válido." });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "La contraseña debe tener entre 8 y 128 caracteres." });
    }

    const existente = await Usuario.findOne({ email });
    if (existente) return res.status(409).json({ message: "Este correo ya está registrado." });

    const usuario = await Usuario.create({ nombre, email, password, rol: "ciudadano" });
    iniciarSesion(res, usuario);
    return res.status(201).json({ message: "Cuenta creada correctamente.", usuario: usuarioPublico(usuario) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Este correo ya está registrado." });
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Correo y contraseña son obligatorios." });

    const usuario = await Usuario.findOne({ email }).select("+password");
    const valido = usuario?.password && await usuario.compararPassword(password);
    if (!valido) return res.status(401).json({ message: "Credenciales inválidas." });

    iniciarSesion(res, usuario);
    return res.json({ message: "Inicio de sesión correcto.", usuario: usuarioPublico(usuario) });
  } catch (error) {
    next(error);
  }
}

async function perfil(req, res) {
  return res.json({ usuario: usuarioPublico(req.usuario) });
}

function logout(req, res) {
  res.clearCookie("vozy_token", {
    httpOnly: true,
    secure: process.env.APP_URL?.startsWith("https://") || process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api"
  });
  res.json({ message: "Sesión cerrada." });
}

module.exports = { registrar, login, perfil, logout, iniciarSesion, usuarioPublico };
