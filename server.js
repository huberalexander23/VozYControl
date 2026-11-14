require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE || "vozycontrol";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const categories = ["Agua potable", "Salud", "Educación", "Energía"];

const evidenceSchema = new mongoose.Schema({
  filename: { type: String, maxlength: 180 },
  mimetype: String,
  size: Number,
  data: Buffer
}, { _id: false });

const reportSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: categories },
  location: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  reporterName: { type: String, trim: true, maxlength: 100, default: "Usuario" },
  status: { type: String, enum: ["Pendiente", "En curso", "Resuelto"], default: "Pendiente" },
  evidence: { type: evidenceSchema, default: null }
}, { timestamps: true, collection: "reportes" });

reportSchema.index({ createdAt: -1 }, { name: "reportes_fecha_creacion" });
const Report = mongoose.models.Reporte || mongoose.model("Reporte", reportSchema);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error("El archivo debe ser JPG, PNG, WEBP o PDF."));
    }
    callback(null, true);
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(express.json({ limit: "100kb" }));
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));
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

app.get("/api/reportes", async (req, res, next) => {
  try {
    const reports = await Report.find()
      .select("-evidence.data")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

app.post("/api/reportes", upload.single("evidencia"), async (req, res, next) => {
  try {
    const category = String(req.body.categoria || "").trim();
    const location = String(req.body.ubicacion || "").trim();
    const description = String(req.body.descripcion || "").trim();
    const reporterName = String(req.body.reporterName || "Usuario").trim().slice(0, 100);

    if (!categories.includes(category)) {
      return res.status(400).json({ message: "Selecciona una categoría válida." });
    }
    if (location.length < 3 || location.length > 180) {
      return res.status(400).json({ message: "La ubicación debe tener entre 3 y 180 caracteres." });
    }
    if (description.length < 10 || description.length > 3000) {
      return res.status(400).json({ message: "La descripción debe tener entre 10 y 3000 caracteres." });
    }

    const evidence = req.file ? {
      filename: path.basename(req.file.originalname).slice(0, 180),
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer
    } : null;

    const report = await Report.create({ category, location, description, reporterName, evidence });
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

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "El archivo supera el máximo permitido de 5 MB."
      : "No se pudo procesar el archivo adjunto.";
    return res.status(400).json({ message });
  }
  if (error.message && error.message.startsWith("El archivo debe ser")) {
    return res.status(400).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: "Ocurrió un error al procesar la solicitud." });
});

async function start() {
  if (!MONGODB_URI) {
    console.error("Falta configurar MONGODB_URI en las variables de entorno.");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME, serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB conectado:", mongoose.connection.name);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`VozYControl disponible en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No fue posible conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

start();
