
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const BranchSchema = new Schema({
  name: String,
  location: String,
  bookingCutoff: String,
  isActive: Boolean
});

export default model("Branch", BranchSchema);
