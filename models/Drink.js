
const { Schema, model } = require("mongoose");

const DrinkSchema = new Schema({
  name: String,
  category: String,
  basePrices: { type: Map, of: Number },
  currentPrices: { type: Map, of: Number },
  stock: { type: Map, of: Number },
});

module.exports = model("Drink", DrinkSchema);
