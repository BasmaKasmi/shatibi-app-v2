import mongoose from "mongoose";

const scaleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: false,
  },
  end: {
    type: String,
    required: false,
  },
  min: {
    type: String,
    required: false,
  },
  max: {
    type: String,
    required: false,
  },
  qualitativeScaleNames: {
    type: Array<String>,
    required: false,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  delete: { type: Boolean, required: false },
});

export default mongoose.models.Scale || mongoose.model("Scale", scaleSchema);
