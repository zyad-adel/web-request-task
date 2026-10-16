const { AppDataSource } = require("../db");
const Note = require("../entities/Note");

class NoteRepository {
  constructor() {
    this.noteRepository = AppDataSource.getRepository(Note);
  }
  async createNote(noteData) {
    const note = this.noteRepository.create(noteData);
    return await this.noteRepository.save(note);
  }
  async getNoteById(id) {
    return await this.noteRepository.findOne({ where: { id }, relations: ["user"] });
  }
  async updateNote(id, noteData) {
    await this.noteRepository.update(id, noteData);
    return await this.getNoteById(id);
  }
  async deleteNote(id) {
    const note = await this.getNoteById(id);
    if (note) {
      await this.noteRepository.remove(note);
      return true;
    }
    return false;
  }
}

module.exports = NoteRepository;
