// src/index.js
import express from "express";
import cors from "cors";
import NoteRoute from "./routes/diaryRoutes.js"; // Mengimpor routes Diary
import AuthRoute from "./routes/authRoutes.js";
import TransactionRoute from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(TransactionRoute);
app.use(AuthRoute);
app.use("/categories", categoryRoutes);
app.use("/goals", goalRoutes);
app.use(express.json());
app.use(NoteRoute); // Menggunakan routes untuk CRUD Diary

// Memulai server
app.listen(5000, () => console.log("Server is running on port 5000"));
