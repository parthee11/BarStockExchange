
const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  userId: String,
  branchId: String,
  items: [
    {
      drinkId: String,
      quantity: Number,
      lockedPrice: Number,
    }
  ],
  table: String,
  timestamp: Date,
  loyaltyPoints: { type: Number, default: 0 },
});

module.exports = model("Order", OrderSchema);
