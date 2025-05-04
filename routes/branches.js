
import express from "express";
import Branch from "../models/Branch.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Get all branches
router.get("/", authenticateToken, async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

// Add a new branch
router.post("/", async (req, res) => {
  const newBranch = new Branch(req.body);
  await newBranch.save();
  res.status(201).json(newBranch);
});

// Update a branch
router.put("/:id", async (req, res) => {
  const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete a branch
router.delete("/:id", async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
