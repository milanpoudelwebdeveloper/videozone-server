import express from "express";
import {
  getSubscriptions,
  subscribe,
  unSubscribe,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.post("/subscribe/:id", verifyToken, subscribe);
router.delete("/subscribe/:id", verifyToken, unSubscribe);
router.get("/subscriptions", verifyToken, getSubscriptions);

export default router;
