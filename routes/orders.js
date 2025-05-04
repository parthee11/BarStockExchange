import express from "express";
import Order from "../models/Order.js";
import Drink from "../models/Drink.js";
import Branch from "../models/Branch.js";
import User from "../models/User.js";

const router = express.Router();
const app = express();

router.post("/", async (req, res) => {
  try {
    const { userId, branchId, items, table, timestamp } = req.body;
    const emitPriceUpdate = req.app.get("emitPriceUpdate");

    const branch = await Branch.findById(branchId);
    const bookingHourLimit = parseInt(branch.bookingCutoff.split(":")[0]);
    const orderTime = new Date(timestamp);
    const hourOfBooking = orderTime.getHours();

    if (hourOfBooking >= bookingHourLimit) {
      return res
        .status(400)
        .json({ error: "Booking not allowed after cutoff time" });
    }

    let totalPrice = 0;
    const lockedItems = await Promise.all(
      items.map(async (item) => {
        const drink = await Drink.findById(item.drinkId);
        const lockedPrice = drink.currentPrices.get(branchId);
        totalPrice += lockedPrice * item.quantity;

        // Deduct stock
        const currentStock = drink.stock.get(branchId) || 0;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for drink: ${drink.name}`);
        }
        drink.stock.set(branchId, currentStock - item.quantity);

        // Simulate price increase (placeholder logic)
        const newPrice = lockedPrice + 1; // simple logic for now
        drink.currentPrices.set(branchId, newPrice);
        await drink.save();

        return {
          drinkId: item.drinkId,
          quantity: item.quantity,
          lockedPrice,
        };
      }),
    );

    // Loyalty points placeholder
    const loyaltyPointsEarned = Math.floor(totalPrice / 100);

    const newOrder = new Order({
      userId,
      branchId,
      items: lockedItems,
      table,
      timestamp: orderTime,
      loyaltyPoints: loyaltyPointsEarned,
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: loyaltyPointsEarned },
    });

    // Emit updated prices
    await emitPriceUpdate(branchId);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: error.message || "Failed to place order" });
  }
});

export default router;
