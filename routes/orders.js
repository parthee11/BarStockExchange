const router = require("express").Router();
const Order = require("../models/Order");
const Drink = require("../models/Drink");
const Branch = require("../models/Branch");
const User = require("../models/User");

// Place an order with price lock, booking validation, loyalty point placeholder, and stock deduction
router.post("/", async (req, res) => {
  try {
    const { userId, branchId, items, table, timestamp } = req.body;

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
        await drink.save();

        return {
          drinkId: item.drinkId,
          quantity: item.quantity,
          lockedPrice,
        };
      }),
    );

    // Placeholder loyalty points logic: 1 point per 100 currency spent
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

    // Add points to user
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: loyaltyPointsEarned },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: error.message || "Failed to place order" });
  }
});

module.exports = router;
