
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: String,
  firebaseUid: { type: String, unique: true },
  name: String,
  loyaltyPoints: { type: Number, default: 0 },
  isGuest: Boolean,
});

export default model("User", UserSchema);
