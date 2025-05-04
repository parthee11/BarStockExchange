
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DrinkSchema = new Schema({
  name: String,
  category: String,
  basePrices: { type: Map, of: Number },
  currentPrices: { type: Map, of: Number },
  stock: { type: Map, of: Number },
});

export default model("Drink", DrinkSchema);
