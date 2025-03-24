// src/index.js
import express from "express";
import cors from "cors";
import NoteRoute from "./routes/diaryRoutes.js";  // Mengimpor routes Diary

const app = express();

app.use(cors());
app.use(express.json());
app.use(NoteRoute);  // Menggunakan routes untuk CRUD Diary

// Memulai server
app.listen(5000, () => console.log("Server is running on port 5000"));
