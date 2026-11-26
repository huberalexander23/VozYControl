const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: function () { return !this.googleId; }
  },
  googleId: { type: String, unique: true, sparse: true },
  rol: { type: String, enum: ["ciudadano", "admin"], default: "ciudadano" }
}, { timestamps: true });

usuarioSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

usuarioSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

module.exports = mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
