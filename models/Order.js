
import mongoose from "mongoose";
const { Schema, model } = mongoose;

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

export default model("Order", OrderSchema);
