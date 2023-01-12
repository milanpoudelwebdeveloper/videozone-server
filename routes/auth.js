import express from "express";
import { login, refreshToken, signUp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/refresh", refreshToken);

export default router;
