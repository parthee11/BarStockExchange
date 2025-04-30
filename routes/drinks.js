const router = require("express").Router();
const Drink = require("../models/Drink");

// Get all drinks
router.get("/", async (req, res) => {
  const drinks = await Drink.find();
  res.json(drinks);
});

// Add a new drink
router.post("/", async (req, res) => {
  const newDrink = new Drink(req.body);
  await newDrink.save();
  res.status(201).json(newDrink);
});

// Update a drink
router.put("/:id", async (req, res) => {
  const updated = await Drink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete a drink
router.delete("/:id", async (req, res) => {
  await Drink.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
