const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
  filename: { type: String, maxlength: 180 },
  mimetype: String,
  size: Number,
  data: Buffer
}, { _id: false });

const reportSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, index: true },
  category: { type: String, required: true, enum: ["Agua potable", "Salud", "Educación", "Energía"] },
  location: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  reporterName: { type: String, trim: true, maxlength: 100, required: true },
  status: { type: String, enum: ["Pendiente", "En curso", "Resuelto"], default: "Pendiente" },
  evidence: { type: evidenceSchema, default: null }
}, { timestamps: true, collection: "reportes" });

reportSchema.index({ createdAt: -1 }, { name: "reportes_fecha_creacion" });
module.exports = mongoose.models.Reporte || mongoose.model("Reporte", reportSchema);
