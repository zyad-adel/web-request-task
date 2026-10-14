const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const err = new Error("All fields are required");
      err.status = 400;
      throw err;
    }
    const hashed = await bcrypt.hash(password, 10);
    
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [name, email, hashed]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error("Wrong email or password");
      err.status = 401;
      throw err;
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
