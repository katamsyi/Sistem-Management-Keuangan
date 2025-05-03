import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controller/transactionController.js";
import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js"; // jika ingin include kategori di relasi

const router = express.Router();

router.get("/transactions/:user_id", async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { user_id: req.params.user_id },
    include: [{ model: Category, attributes: ["name"] }],
  });
  res.json(transactions);
});

// Ambil semua transaksi user tertentu
router.get("/transactions/:user_id", getTransactions);

// Tambah transaksi
router.post("/transactions", createTransaction);

// Update transaksi
router.put("/transactions/:id", updateTransaction);

// Hapus transaksi
router.delete("/transactions/:id", deleteTransaction);

export default router;
