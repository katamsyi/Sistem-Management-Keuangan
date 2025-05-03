import express from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);

// ➕ Tambahan:
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
