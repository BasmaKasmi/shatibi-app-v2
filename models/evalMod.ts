import mongoose from 'mongoose';

const schema = mongoose.Schema;
const objId = schema.ObjectId;

const evalModSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    format: { type: String, required: true },
    scale: { type: [objId], ref: 'Scale', required: true },
    coef: { type: Number, required: true },
    teacherId: { type: [String] },
    department: { type: [String], required: true },
    delete: { type: Boolean, required: false}
});

export default mongoose.models.EvalMod || mongoose.model('EvalMod', evalModSchema);
