const express = require("express");
const { AppDataSource } = require("./db");
const errorHandler = require("./middleware/errorHandler");
const noteRouter = require("./routes/note.router");

const app = express();
app.use(express.json());

app.use("/notes", noteRouter);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = app;
