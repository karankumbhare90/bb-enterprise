import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB will automatically delete expired sessions
    },
  },
  { timestamps: true }
);

// Prevent mongoose from creating the model multiple times in development
const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;
