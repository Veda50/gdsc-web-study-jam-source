import express from "express"
import { notesData } from "./notes.js";
import crypto from "crypto";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Helloworld");
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    const id = crypto.randomUUID();

    const newData = { id, title, content };

    notesData.push(newData);
    console.log(notesData)
    res.status(201).json({ "msg": "Success", id });
})

app.get('/notes', (req, res) => {
    res.status(200).json(notesData);
});

app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const index = notesData.findIndex((note) => note.id === id);

    if (index !== -1) {
        notesData[index] = {
            ...notesData[index],
            title,
            content,
        }

        res.status(200).json({ "msg": "Success" });
    } else {
        res.status(404).json({ "msg": "Not found" })
    }
})

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const index = notesData.findIndex((note) => note.id === id);

    if (index !== -1) {
        notesData.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(400).json({ "msg": "Not found" })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})