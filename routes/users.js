import express from "express";
import {
  addIntoPlaylist,
  getPlaylists,
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
router.get("/playlists", verifyToken, getPlaylists);
router.put("/playlists/:id", verifyToken, addIntoPlaylist);

export default router;
