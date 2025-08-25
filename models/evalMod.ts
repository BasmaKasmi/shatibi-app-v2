import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const evalModSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  format: { type: String, required: true },
  scale: { type: [ObjectId], ref: "Scale", required: true },
  coef: { type: Number, required: true },
  teacherId: { type: [String] },
  department: { type: [String], required: true },
  delete: { type: Boolean, required: false },
});

const EvalMod =
  mongoose.models.EvalMod || mongoose.model("EvalMod", evalModSchema);

export default EvalMod;
