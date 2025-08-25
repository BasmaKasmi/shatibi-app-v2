import mongoose from "mongoose"

const schema = mongoose.Schema;
const objId = schema.ObjectId;

const ratingSchema = new schema({
    evalSheetId: {
        type: objId,
        ref: 'EvalSheet',
        required: true,
    },
    studentId: {
        type: String,
        required: true,
    },
    appreciation: {
        type: String,
        required: false,
    },
    score: {
        type: String,
        required: true,
    },
    nc: {
        type: Boolean,
        required: false,
    },
    abs: {
        type: Boolean,
        required: false,
    },
})

export default mongoose.models.Rating || mongoose.model('Rating', ratingSchema)