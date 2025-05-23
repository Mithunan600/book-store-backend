const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// MIDDLEWARE
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-store-backend-theta-five.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// ROUTES
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ MOVE THIS OUTSIDE main()
app.get("/", (req, res) => {
  res.send("THIS IS WORKING WITH NODEMON");
});

async function main() {
  await mongoose.connect(process.env.MONGOURL);
  console.log("MONGODB CONNECTED");
}

main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("SERVER STARTED AT PORT::" + port);
});
