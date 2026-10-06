import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

app.get('/notes', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM notes');
    res.send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

app.get('/notes/search', async (req, res) => {
  const word = req.query.query;
  try {
    const data = await pool.query(
      'SELECT * FROM notes WHERE title ILIKE $1 OR content ILIKE $1',
      ['%' + word + '%']
    );
    res.send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

app.post('/notes', async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  try {
    const newNote = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).send(newNote.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

app.put('/notes/:id', async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const updatedNote = await pool.query(
      'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    if (updatedNote.rows.length === 0) {
      return res.status(404).send('Note not found');
    }

    res.send(updatedNote.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

app.delete('/notes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedNote = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );

    if (deletedNote.rows.length === 0) {
      return res.status(404).send('Note not found');
    }

    res.send({ message: 'Note deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
