import express from "express";
import { login, logOut, refreshToken, signUp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/logout", logOut);

export default router;
