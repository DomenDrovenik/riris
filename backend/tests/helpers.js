const jwt = require("jsonwebtoken");

// Ustvari veljaven JWT za podanega uporabnika (za Authorization header).
const tokenFor = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

const customer = { id: 1, email: "stranka@test.si", role: "CUSTOMER" };
const technician = { id: 2, email: "serviser@test.si", role: "TECHNICIAN" };
const admin = { id: 3, email: "admin@test.si", role: "ADMIN" };

module.exports = { tokenFor, customer, technician, admin };
