import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Drink from "./models/Drink.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
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
app.use("/api/auth", (await import("./routes/auth.js")).default);
app.use("/api/drinks", (await import("./routes/drinks.js")).default);
app.use("/api/branches", (await import("./routes/branches.js")).default);
app.use("/api/orders", (await import("./routes/orders.js")).default);
app.use("/api/users", (await import("./routes/users.js")).default);

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
  const updatedPrices = drinks.map((drink) => ({
    drinkId: drink._id,
    price:
      drink.currentPrices.get(branchId) || drink.basePrices.get(branchId) || 0,
  }));
  io.emit("priceUpdate", { branchId, prices: updatedPrices });
};

// Expose price update function for reuse
app.set("emitPriceUpdate", emitPriceUpdate);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
