import express from "express";
import {
  getGoalsByUser,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controller/goalController.js";

const router = express.Router();

router.get("/:userId", getGoalsByUser);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
