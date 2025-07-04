import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  attendance: { type: String, default: "absent" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Participant || mongoose.model("Participant", ParticipantSchema);
