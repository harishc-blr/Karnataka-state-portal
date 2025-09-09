const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let users = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  res.send("✅ Registered successfully. <a href='/login.html'>Login here</a>");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.send("❌ User not found");

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.send("❌ Invalid password");

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.send(`✅ Login successful. Token: ${token}`);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));