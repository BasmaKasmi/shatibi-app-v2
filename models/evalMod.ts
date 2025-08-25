// @ts-nocheck

import mongoose from "mongoose";

const evalModSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  format: { type: String, required: true },
  scale: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Scale",
    required: true,
  },
  coef: { type: Number, required: true },
  teacherId: { type: [String] },
  department: { type: [String], required: true },
  delete: { type: Boolean, required: false },
});

let EvalMod: any;

try {
  EvalMod = mongoose.model("EvalMod");
} catch {
  EvalMod = mongoose.model("EvalMod", evalModSchema);
}

export default EvalMod;
