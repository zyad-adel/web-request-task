const NoteService = require("../src/services/note.service");
const NoteRepository = require("../src/repositories/note.repository");

jest.mock("../src/repositories/note.repository");

describe("NoteService Unit Tests", () => {
  let noteService;
  let mockNoteRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    noteService = new NoteService();
    mockNoteRepository = noteService.noteRepository;
  });

  test("should return a note when valid id is provided", async () => {
    const sampleNote = { id: 1, title: "Test Note", content: "Hello" };
    mockNoteRepository.getNoteById.mockResolvedValue(sampleNote);

    const result = await noteService.getNoteById(1);
    expect(result).toEqual(sampleNote);
    expect(mockNoteRepository.getNoteById).toHaveBeenCalledWith(1);
  });

  test("should throw 404 error when note is not found", async () => {
    mockNoteRepository.getNoteById.mockResolvedValue(null);

    await expect(noteService.getNoteById(999)).rejects.toThrow("Note not found");
  });
});
