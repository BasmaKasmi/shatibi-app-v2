import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvalSheet extends Document {
  modId: mongoose.Types.ObjectId;
  subject: string;
  passageDate: Date;
  sendDate?: Date;
  statut: string;
  scaleId: mongoose.Types.ObjectId;
  groupId: string;
  teacherId?: string[];
  groups?: string[];
  delete?: boolean;
}

const evalSheetSchema = new Schema<IEvalSheet>({
  modId: { type: Schema.Types.ObjectId, ref: "EvalMod", required: true },
  subject: { type: String, required: true },
  passageDate: { type: Date, required: true },
  sendDate: { type: Date },
  statut: { type: String, required: true, default: "À venir" },
  scaleId: { type: Schema.Types.ObjectId, ref: "Scale", required: true },
  groupId: { type: String, required: true },
  teacherId: [{ type: String }], // 👈 ajouté
  groups: [{ type: String }], // 👈 ajouté
  delete: { type: Boolean },
});

let EvalSheet: Model<IEvalSheet>;
try {
  EvalSheet = mongoose.model<IEvalSheet>("EvalSheet");
} catch {
  EvalSheet = mongoose.model<IEvalSheet>("EvalSheet", evalSheetSchema);
}
export default EvalSheet;
