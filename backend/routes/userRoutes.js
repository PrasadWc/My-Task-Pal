import express from "express";
import { createUser,login, resetPassword, sendPasswordResetOTP, getUser, changePassword } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", createUser);
router.post("/login", login);
router.post("/sendresetotp", sendPasswordResetOTP);
router.post("/resetpassword", resetPassword);
router.get("/getuser",authenticateUser, getUser);
router.post("/changepassword", authenticateUser, changePassword);


export default router;