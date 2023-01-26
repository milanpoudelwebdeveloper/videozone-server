import express from "express";
import { unAuthVerify, verifyToken } from "../middlewares/verifyJwt.js";
import {
  deleteVideo,
  dislikeVideo,
  getchannelVideos,
  getLikedVideos,
  getVideoDetails,
  getVideos,
  likeVideo,
  updateVideo,
  uploadVideo,
} from "../controllers/videos.js";

const router = express.Router();

router.get("/:category", getVideos);
router.post("/", verifyToken, uploadVideo);
router.get("/find/:id", unAuthVerify, getVideoDetails);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.put("/like/:id", verifyToken, likeVideo);
router.put("/dislike/:id", verifyToken, dislikeVideo);
router.get("/channel/:id", unAuthVerify, getchannelVideos);
router.get("/likedVideos/:channelId", getLikedVideos);

export default router;
