
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const Drink = require("./models/Drink");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Beverage Ordering API" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/drinks", require("./routes/drinks"));
app.use("/api/branches", require("./routes/branches"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// Socket.IO logic for real-time pricing
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Function to emit price updates
const emitPriceUpdate = async (branchId) => {
  const drinks = await Drink.find();
  const updatedPrices = drinks.map(drink => ({
    drinkId: drink._id,
    price: drink.currentPrices.get(branchId) || drink.basePrices.get(branchId) || 0
  }));
  io.emit("priceUpdate", { branchId, prices: updatedPrices });
};

// Expose price update function for reuse
app.set("emitPriceUpdate", emitPriceUpdate);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
