





import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: "Name and email required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email." });

    // FIX 4: enforce @4brains.in on the server side too.
    // Without this, anyone can bypass the frontend and POST any email directly.
    if (!email.endsWith("@4brains.in"))
      return res.status(400).json({ message: "Only @4brains.in emails allowed." });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    } else {
      // Update name if it changed since last login
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }
    }

    // Include name in token so authMiddleware can pass it to the upload controller
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
}