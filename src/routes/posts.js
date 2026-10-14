const router = require("express").Router();
const pool = require("../config/db");
const { protect } = require("../middleware/auth");


router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at, u.name AS author
       FROM posts p JOIN users u ON u.id = p.author_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      const err = new Error("Title and content are required");
      err.status = 400;
      throw err;
    }
    const { rows } = await pool.query(
      "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    const post = rows[0];
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    const isOwner = post.author_id === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      const err = new Error("You don't have permission");
      err.status = 403;
      throw err;
    }
    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

module.exports = router;