
const { Schema, model } = require("mongoose");

const BranchSchema = new Schema({
  name: String,
  location: String,
  bookingCutoff: String,
  isActive: Boolean
});

module.exports = model("Branch", BranchSchema);
