import express from "express";
import { unAuthVerify, verifyToken } from "../middlewares/verifyJwt.js";
import {
  deleteVideo,
  dislikeVideo,
  getVideoDetails,
  getVideos,
  likeVideo,
  updateVideo,
  uploadVideo,
} from "../controllers/videos.js";

const router = express.Router();

router.get("/", getVideos);
router.post("/", verifyToken, uploadVideo);
router.get("/:id", unAuthVerify, getVideoDetails);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.put("/like/:id", verifyToken, likeVideo);
router.put("/dislike/:id", verifyToken, dislikeVideo);

export default router;
