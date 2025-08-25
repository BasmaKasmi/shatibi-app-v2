import mongoose from 'mongoose';

const schema = mongoose.Schema;
const objId = schema.ObjectId;

const evalSheetSchema = new schema({
    modId: {
        type: objId,
        ref: "EvalMod", // Use model name directly to avoid circular dependency
        required: true,
    },
    subject: { type: String, required: true },
    passageDate: { type: Date, required: true },
    sendDate: { type: Date, required: false },
    statut: { type: String, required: true, default: "À venir" },
    scaleId: { type: objId, ref: "Scale", required: true },
    groupId: { type: String, required: true },
    delete: { type: Boolean, required: false}
});

export default mongoose.models.EvalSheet || mongoose.model('EvalSheet', evalSheetSchema);
