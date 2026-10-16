const express = require('express');
const NoteController = require('../controllers/note.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { noteSchema } = require('../validators/note.validator');

const router = express.Router();
router.use(authMiddleware);

router.post('/', validate(noteSchema), (req, res) => new NoteController().createNote(req, res));
router.get('/:id', (req, res) => new NoteController().getNoteById(req, res));
router.put('/:id', validate(noteSchema), (req, res) => new NoteController().updateNote(req, res));
router.delete('/:id', (req, res) => new NoteController().deleteNote(req, res));

module.exports = router;
