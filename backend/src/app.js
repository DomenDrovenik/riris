const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");

const app = express();

// Namerna napaka za preverjanje zaščite veje (no-unused-vars).
const neuporabljenaSpremenljivka = 42;

app.use(express.json());
app.use(
  cors({
    // V produkciji URL nameščenega frontenda (npr. https://servisdesk.netlify.app).
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ServisDesk backend deluje." });
});

module.exports = app;
