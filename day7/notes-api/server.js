const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AppDataSource = require("./db");
const UserSchema = require("./entities/user");
const NoteSchema = require("./entities/note");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log("Database connection error:", error));

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(UserSchema);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(UserSchema);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const noteRepository = AppDataSource.getRepository(NoteSchema);

    const newNote = noteRepository.create({
      content,
      user: { id: req.user.userId },
    });

    await noteRepository.save(newNote);
    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const noteRepository = AppDataSource.getRepository(NoteSchema);
    const { search } = req.query;

    let queryCondition = {
      user: { id: req.user.userId },
    };

    if (search) {
      const { ILike } = require("typeorm");
      queryCondition.content = ILike(`%${search}%`);
    }

    const notes = await noteRepository.find({
      where: queryCondition,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const noteId = req.params.id;
    const noteRepository = AppDataSource.getRepository(NoteSchema);

    const note = await noteRepository.findOne({
      where: { id: noteId, user: { id: req.user.userId } },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    note.content = content || note.content;
    await noteRepository.save(note);

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteRepository = AppDataSource.getRepository(NoteSchema);

    const note = await noteRepository.findOne({
      where: { id: noteId, user: { id: req.user.userId } },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    await noteRepository.remove(note);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});