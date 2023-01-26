import express from "express";
import { addToHistory, getHistory } from "../controllers/history.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/:filter", verifyToken, getHistory);

router.post("/:videoId", verifyToken, addToHistory);

export default router;
