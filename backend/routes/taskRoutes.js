import express from "express";
import { addTask, getAll,updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticateUser, addTask);
router.get("/getall", authenticateUser, getAll);
router.put("/update/:id", authenticateUser, updateTask);
router.delete("/delete/:id", authenticateUser, deleteTask);

export default router;