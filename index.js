// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Models
const Drink = require("./models/Drink");
const Branch = require("./models/Branch");
const Order = require("./models/Order");
const User = require("./models/User");

// Routes
app.use("/api/drinks", require("./routes/drinks"));
app.use("/api/branches", require("./routes/branches"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// backend/models/Drink.js
const { Schema, model } = require("mongoose");

const DrinkSchema = new Schema({
  name: String,
  category: String,
  basePrices: { type: Map, of: Number },
  currentPrices: { type: Map, of: Number },
  stock: { type: Map, of: Number },
});

module.exports = model("Drink", DrinkSchema);

// backend/models/Branch.js
const BranchSchema = new Schema({
  name: String,
  location: String,
  bookingCutoff: String, // e.g., "22:00"
  isActive: Boolean
});

module.exports = model("Branch", BranchSchema);

// backend/models/Order.js
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

// backend/models/User.js
const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  loyaltyPoints: { type: Number, default: 0 },
  isGuest: Boolean,
});

module.exports = model("User", UserSchema);