import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

const getNotes = () => {
    if (!fs.existsSync('notes.json')) return [];
    return JSON.parse(fs.readFileSync('notes.json', 'utf8'));
};

app.get('/notes', (req, res) => {
    res.json(getNotes());
});

app.post('/notes', (req, res) => {
    const notes = getNotes();
    const newNote = { id: Date.now(), title: req.body.title, content: req.body.content };
    notes.push(newNote);
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
    res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
    const notes = getNotes();
    const note = notes.find((n: any) => n.id == req.params.id);
    if (!note) return res.status(404).json({ message: "Not found" });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
    res.json(note);
});

app.delete('/notes/:id', (req, res) => {
    const notes = getNotes();
    const newNotes = notes.filter((n: any) => n.id != req.params.id);
    fs.writeFileSync('notes.json', JSON.stringify(newNotes, null, 2));
    res.json({ message: "Deleted" });
});

app.listen(4000, () => console.log("Server running on port 4000"));
