// @ts-nocheck OR keep strict checking and add types manually

import mongoose, { Schema, Model, Document } from "mongoose";

interface EvalSheet extends Document {
  title: string;
  description?: string;
  format: string;
  scale: mongoose.Types.ObjectId[];
  coef: number;
  teacherId?: string[];
  department: string[];
  delete?: boolean;
}

const evalSheetSchema = new Schema<EvalSheet>({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  format: { type: String, required: true },
  scale: [{ type: Schema.Types.ObjectId, ref: "Scale", required: true }],
  coef: { type: Number, required: true },
  teacherId: [{ type: String }],
  department: [{ type: String, required: true }],
  delete: { type: Boolean },
});

let EvalSheetModel: Model<EvalSheet>;

try {
  EvalSheetModel = mongoose.model<EvalSheet>("EvalSheet");
} catch {
  EvalSheetModel = mongoose.model<EvalSheet>("EvalSheet", evalSheetSchema);
}

export default EvalSheetModel;
