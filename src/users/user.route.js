const express = require("express");
const mongoose = require("mongoose");
const User = require("./user.model");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Ensure JWT_SECRET is set

// ✅ Check if the API is reachable
router.get("/", (req, res) => {
    res.status(200).send({ message: "User API is working!" });
});

// ✅ Admin Login Route with Debugging
router.post("/admin", async (req, res) => {
    const { username, password } = req.body;
    console.log("🔍 Received login request for:", username);

    try {
        // ✅ Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.error("❌ MongoDB not connected!");
            return res.status(500).json({ message: "Database connection error" });
        }

        // ✅ Fetch admin from the database
        const admin = await User.findOne({ username });
        console.log("🔍 Admin found:", admin);

        if (!admin) {
            console.warn("⚠️ Admin not found for username:", username);
            return res.status(404).json({ message: "Admin not found!" });
        }

        // ✅ Check password (since it's stored in plain text)
        if (admin.password !== password) {
            console.warn("⚠️ Invalid password for:", username);
            return res.status(401).json({ message: "Invalid password!" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ Authentication successful for:", username);
        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("❌ Failed to login as admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
