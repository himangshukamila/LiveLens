
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  name: { type: String, default: "Unknown" },
  path: { type: String, required: true }, // public path e.g. /uploads/xyz.jpg
  mimeType: { type: String, default: "image/jpeg" }
}, { timestamps: true });

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);