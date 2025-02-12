const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { timestamps: true }
);


friendSchema.index({ "users.0": 1, "users.1": 1 }, { unique: true });

// duplicate from here .. understand more the index .. what does it do 


module.exports = mongoose.model("Friend", friendSchema);
