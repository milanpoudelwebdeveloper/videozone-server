import express from "express";
import {
  addIntoPlaylist,
  createPlaylist,
  deleteFromPlaylist,
  getPlaylists,
  getPlayListVideos,
  getVideoPlaylists,
} from "../controllers/playlists.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/:channelId", getPlaylists);
router.get("/videos/:playlistId", getPlayListVideos);
router.post("/", verifyToken, createPlaylist);
router.put("/:playlistId", verifyToken, addIntoPlaylist);
router.get("/find/:videoId", verifyToken, getVideoPlaylists);
router.delete("/:playlistId", verifyToken, deleteFromPlaylist);

export default router;
