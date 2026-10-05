const express = require('express');
const { ILike } = require('typeorm');
const AppDataSource = require('./db');

const app = express();
app.use(express.json());
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

app.get('/users/search', async (req, res) => {
    const { q } = req.query; 
    const UserRepository = AppDataSource.getRepository('user');

    const users = await UserRepository.find({
        where: [
            { username: ILike(`%${q}%`) },
            { email: ILike(`%${q}%`) }
        ]
    });

    res.json(users);
});

app.get('/notes/search', async (req, res) => {
    const { q } = req.query;
    const NoteRepository = AppDataSource.getRepository('note');

    const notes = await NoteRepository.find({
        where: [
            { title: ILike(`%${q}%`) },
            { content: ILike(`%${q}%`) }
        ],
        relations: ['user']
    });

    res.json(notes);
});

app.get('/users', async (req, res) => {
    const UserRepository = AppDataSource.getRepository('user');
    const users = await UserRepository.find();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const UserRepository = AppDataSource.getRepository('user');
    const newUser = UserRepository.create(req.body);
    const savedUser = await UserRepository.save(newUser);
    res.status(201).json(savedUser);
});

app.post('/notes', async (req, res) => {
    const { title, content, userId } = req.body;
    const NoteRepository = AppDataSource.getRepository('note');
    const UserRepository = AppDataSource.getRepository('user');

    const user = await UserRepository.findOneBy({ id: userId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newNote = NoteRepository.create({ title, content, user });
    const savedNote = await NoteRepository.save(newNote);
    res.status(201).json(savedNote);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});