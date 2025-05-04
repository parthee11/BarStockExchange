
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: String,
  firebaseUid: { type: String, unique: true },
  name: String,
  loyaltyPoints: { type: Number, default: 0 },
  isGuest: Boolean,
});

module.exports = model("User", UserSchema);
