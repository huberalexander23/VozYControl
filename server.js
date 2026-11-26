require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const Report = require("./models/Reporte");
const { verificarToken, permitirRoles } = require("./middlewares/auth.middleware");

require("./config/passport");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE || "vozycontrol";
const APP_ORIGIN = process.env.APP_URL ? new URL(process.env.APP_URL).origin : null;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const categories = ["Agua potable", "Salud", "Educación", "Energía"];

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
const allowedOrigins = new Set([
  APP_ORIGIN,
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : [])
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    // Las llamadas sin Origin (por ejemplo, health checks) no usan CORS.
    if (!origin) return callback(null, false);
    let normalizedOrigin;
    try {
      normalizedOrigin = new URL(origin).origin;
    } catch {
      return callback(new Error("Origen inválido."));
    }
    app.use("/api", (req, res, next) => {
  const changesData = !["GET", "HEAD", "OPTIONS"].includes(req.method);

  // Solo las operaciones autenticadas mediante cookie necesitan esta
  // comprobación de origen. El login y el registro todavía no tienen JWT.
  if (!changesData || !req.cookies?.vozy_token) return next();

  const requestOrigin = req.get("Origin");
  if (!requestOrigin) {
    return res.status(403).json({
      message: "No se recibió el origen de la solicitud."
    });
  }

  let normalizedOrigin;
  try {
    normalizedOrigin = new URL(requestOrigin).origin;
  } catch {
    return res.status(403).json({
      message: "El origen de la solicitud no es válido."
    });
  }

  if (!allowedOrigins.has(normalizedOrigin)) {
    console.error("Origen rechazado:", {
      recibido: normalizedOrigin,
      permitidos: [...allowedOrigins]
    });
    return res.status(403).json({
      message: "Origen de solicitud no permitido."
    });
  }

  next();
});-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: Boolean(APP_ORIGIN?.startsWith("https://")),
    sameSite: "lax",
    maxAge: 10 * 60 * 1000
  }
}));
app.use(passport.initialize());

app.use("/api", (req, res, next) => {
  const changesData = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (changesData && req.cookies?.vozy_token && req.get("origin") !== APP_ORIGIN) {
    return res.status(403).json({ message: "Origen de solicitud no permitido." });
  }
  next();
});

app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use(express.static(__dirname, {
  dotfiles: "deny",
  index: "index.html",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  }
}));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.name });
});

const evidenceSchema = new mongoose.Schema({
  filename: { type: String, maxlength: 180 },
  mimetype: String,
  size: Number,
  data: Buffer
}, { _id: false });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.mimetype)) return callback(new Error("El archivo debe ser JPG, PNG, WEBP o PDF."));
    callback(null, true);
  }
});

app.get("/api/reportes", verificarToken, async (req, res, next) => {
  try {
    const filter = req.usuario.rol === "admin" ? {} : { usuario: req.usuario._id };
    const reports = await Report.find(filter)
      .select("-evidence.data")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

app.post("/api/reportes", verificarToken, upload.single("evidencia"), async (req, res, next) => {
  try {
    const category = String(req.body.categoria || "").trim();
    const location = String(req.body.ubicacion || "").trim();
    const description = String(req.body.descripcion || "").trim();

    if (!categories.includes(category)) return res.status(400).json({ message: "Selecciona una categoría válida." });
    if (location.length < 3 || location.length > 180) return res.status(400).json({ message: "La ubicación debe tener entre 3 y 180 caracteres." });
    if (description.length < 10 || description.length > 3000) return res.status(400).json({ message: "La descripción debe tener entre 10 y 3000 caracteres." });

    const evidence = req.file ? {
      filename: path.basename(req.file.originalname).slice(0, 180),
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer
    } : null;

    const report = await Report.create({
      usuario: req.usuario._id,
      reporterName: req.usuario.nombre,
      category,
      location,
      description,
      evidence
    });
    res.status(201).json({
      message: "Reporte guardado correctamente.",
      report: {
        _id: report._id,
        category: report.category,
        location: report.location,
        description: report.description,
        reporterName: report.reporterName,
        status: report.status,
        evidence: evidence ? { filename: evidence.filename, mimetype: evidence.mimetype, size: evidence.size } : null,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/reportes/:id/estado", verificarToken, permitirRoles("admin"), async (req, res, next) => {
  try {
    const allowed = ["Pendiente", "En curso", "Resuelto"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Estado no válido." });
    const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).select("-evidence.data");
    if (!report) return res.status(404).json({ message: "Reporte no encontrado." });
    res.json({ message: "Estado actualizado.", report });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "El archivo supera el máximo permitido de 5 MB." : "No se pudo procesar el archivo adjunto.";
    return res.status(400).json({ message });
  }
  if (error.message && error.message.startsWith("El archivo debe ser")) return res.status(400).json({ message: error.message });
  if (error.name === "ValidationError") return res.status(400).json({ message: "Los datos enviados no son válidos." });
  if (error.name === "CastError") return res.status(400).json({ message: "Identificador no válido." });
  console.error(error);
  res.status(500).json({ message: "Ocurrió un error al procesar la solicitud." });
});

async function start() {
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error("Faltan variables de entorno:", missing.join(", "));
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET debe tener al menos 32 caracteres.");
    process.exit(1);
  }
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL);
  if (googleConfigured && (!process.env.OAUTH_SESSION_SECRET || process.env.OAUTH_SESSION_SECRET.length < 32)) {
    console.error("OAUTH_SESSION_SECRET debe tener al menos 32 caracteres cuando Google OAuth está habilitado.");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME, serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB conectado:", mongoose.connection.name);
    app.listen(PORT, "0.0.0.0", () => console.log(`VozYControl disponible en el puerto ${PORT}`));
  } catch (error) {
    console.error("No fue posible conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

start();
