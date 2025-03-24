// src/routes/DiaryRoute.js
import express from "express";
import { createNote, deleteNote, getNote, updateNote } from "../controller/diaryController.js";

const router = express.Router();

// Route untuk mengambil semua diary
router.get("/note", getNote);

// Route untuk menambah diary baru
router.post("/add-note", createNote);

// Route untuk mengupdate diary
router.put("/edit-note/:id", updateNote);

// Route untuk menghapus diary
router.delete("/delete-note/:id", deleteNote);

export default router;
