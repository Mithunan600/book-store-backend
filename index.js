const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ MIDDLEWARE
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://book-store-backend-theta-five.vercel.app"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ ROUTES
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ DATABASE CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

// ✅ START SERVER
app.listen(port, async () => {
  console.log(`🚀 SERVER STARTED AT PORT: ${port}`);
  await connectDB(); // Ensure DB is connected before running the app
});
