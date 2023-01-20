import express from "express";
import { getAllComments, postComment } from "../controllers/comments.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/:videoId", getAllComments);
router.post("/:videoId", verifyToken, postComment);

export default router;
