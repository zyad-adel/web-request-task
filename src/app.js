require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.get("/health", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: rows[0].now });
  } catch (e) { next(e); }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));