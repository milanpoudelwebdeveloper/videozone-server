import express from "express";
import { subscribe, unSubscribe, updateUser } from "../controllers/users.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.post("/subscribe/:id", verifyToken, subscribe);
router.delete("/subscribe/:id", verifyToken, unSubscribe);

export default router;
