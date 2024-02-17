import express from "express"
import { notesData } from "./notes.js";
import crypto from "crypto";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// app.get('/', (req, res) => {
//     res.send("Helloworld");
// });

// app.post('/notes', (req, res) => {
//     const { title, content } = req.body;
//     const id = crypto.randomUUID();

//     const newData = { id, title, content };

//     notesData.push(newData);
//     console.log(notesData)
//     res.status(201).json({ "msg": "Success", id });
// })

// app.get('/notes', (req, res) => {
//     res.status(200).json(notesData);
// });

// app.put('/notes/:id', (req, res) => {
//     const { id } = req.params;
//     const { title, content } = req.body;

//     const index = notesData.findIndex((note) => note.id === id);

//     if (index !== -1) {
//         notesData[index] = {
//             ...notesData[index],
//             title,
//             content,
//         }

//         res.status(200).json({ "msg": "Success" });
//     } else {
//         res.status(404).json({ "msg": "Not found" })
//     }
// })

// app.delete('/notes/:id', (req, res) => {
//     const { id } = req.params;
//     const index = notesData.findIndex((note) => note.id === id);

//     if (index !== -1) {
//         notesData.splice(index, 1);
//         res.status(204).send();
//     } else {
//         res.status(400).json({ "msg": "Not found" })
//     }
// })

// Membuat 1 Data User
app.post('/user', async (req, res) => {
    const { name } = req.body;
    const newUser = await prisma.user.create({
      data: { name },
    });
    res.status(201).json(newUser);
  });
  
  // Membuat Beberapa Catatan
  app.post('/notes', async (req, res) => {
    const { notes } = req.body;
    const newNotes = await prisma.note.createMany({
      data: notes,
    });
    res.status(201).json(newNotes);
  });
  
  // Mendapatkan Semua Data
  app.get('/users', async (req, res) => {
    const allUsers = await prisma.user.findMany({
      include: { Note: true },
    });
    res.status(200).json(allUsers);
  });
  
  // Mendapatkan Data Unik dengan Nama Owner Tertentu
  app.get('/user/:name', async (req, res) => {
    const { name } = req.params;
    const userByName = await prisma.user.findUnique({
      where: { name },
      include: { Note: true },
    });
    res.status(200).json(userByName);
  });
  
  // Update Data Berdasarkan ID
  app.put('/note/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).json(updatedNote);
  });
  
  // Hapus Salah Satu Data
  app.delete('/note/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})