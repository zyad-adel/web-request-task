const NoteService = require("../services/note.service");

class NoteController {
  constructor() {
    this.noteService = new NoteService();
  }
  async createNote(req, res) {
    try {
      const noteData = { ...req.body, userId: req.user.id };
      const note = await this.noteService.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
  async getNoteById(req, res) {
    try {
      const note = await this.noteService.getNoteById(req.params.id);
      res.status(200).json(note);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
  async updateNote(req, res) {
    try {
      const updated = await this.noteService.updateNote(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
  async deleteNote(req, res) {
    try {
      const result = await this.noteService.deleteNote(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}

module.exports = NoteController;
