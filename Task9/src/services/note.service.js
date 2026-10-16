const NoteRepository = require("../repositories/note.repository");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NoteService {
  constructor() {
    this.noteRepository = new NoteRepository();
  }
  async createNote(noteData) {
    try {
      return await this.noteRepository.createNote(noteData);
    } catch (error) {
      throw new AppError("Failed to create note", 500);
    }
  }
  async getNoteById(id) {
    try {
      const note = await this.noteRepository.getNoteById(id);
      if (!note) throw new AppError("Note not found", 404);
      return note;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to retrieve note", 500);
    }
  }
  async updateNote(id, noteData) {
    try {
      const updated = await this.noteRepository.updateNote(id, noteData);
      if (!updated) throw new AppError("Note not found", 404);
      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update note", 500);
    }
  }
  async deleteNote(id) {
    try {
      const deleted = await this.noteRepository.deleteNote(id);
      if (!deleted) throw new AppError("Note not found", 404);
      return { message: "Note deleted successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to delete note", 500);
    }
  }
}

module.exports = NoteService;
