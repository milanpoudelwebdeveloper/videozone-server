import db from "../db/index.js";

export const uploadVideo = async (req, res) => {
  const { title, descp, videoUrl, thumbnail, category } = req.body;
  console.log("req user", req);
  try {
    const q = await db.query(
      "INSERT INTO video(channelId, title, descp, videoUrl, thumbnail, category) VALUES($1, $2, $3, $4, $5, $6) returning *",
      [req.user, title, descp, videoUrl, thumbnail, category]
    );
    if (q.rows.length > 0) {
      res.status(200).json({
        message: "Video uploaded successfully",
        video: q.rows[0],
      });
    }
  } catch (e) {
    console.log("Something went wrong while uploading video", e);
    res.status(500).json({
      message: "Something went wrong while uploading video",
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await db.query("SELECT * FROM video WHERE id =$1", [
      req.params.id,
    ]);
    if (video.rows.length === 0)
      return res.status(404).json({ message: "Video not found" });
    if (video.channelId !== req.user)
      return res.status(401).json({ message: "Unauthorized" });
    await db.query("DELETE FROM video WHERE chhanelId = $1 AND id=$2", [
      req.user,
      req.params.id,
    ]);
    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (e) {
    console.log("Something went wrong while deleting video", e);
    res.status(500).json({
      message: "Something went wrong while deleting video",
    });
  }
};

export const updateVideo = async (req, res) => {
  const { title, descp, thumbnail } = req.body;
  try {
    const video = await db.query("SELECT * FROM video WHERE id =$1", [
      req.params.id,
    ]);
    if (video.rows.length === 0)
      return res.status(404).json({ message: "Video not found" });
    if (video.channelId !== req.user)
      return res.status(401).json({ message: "Unauthorized" });
    const q = await db.query(
      "UPDATE video SET title = $1, descp = $2, thumbnail = $3 WHERE channelId = $4 AND videoId = $5 returning *",
      [title, descp, thumbnail, req.user, req.params.id]
    );
    if (q.rows.length > 0) {
      res.status(200).json({
        message: "Video updated successfully",
        video: q.rows[0],
      });
    }
  } catch (e) {
    console.log("Something went wrong while updating video", e);
    res.status(500).json({
      message: "Something went wrong while updating video",
    });
  }
};

//for now get all vidoes later get videos from subscribed channels
export const getVideos = async (req, res) => {
  let extraPath = "";
  let category = req.params.category;
  if (category && category !== "All") {
    extraPath = `WHERE category = '${category}'`;
  }

  try {
    const q = await db.query(
      `SELECT v.*, c.name as channelName FROM video as v JOIN channels as c ON (v.channelId = c.id) ${extraPath}  ORDER BY v.createdAt DESC `
    );
    if (q.rows.length > 0) {
      res.status(200).json({
        videos: q.rows,
      });
    } else {
      res.status(200).json({
        videos: [],
      });
    }
  } catch (e) {
    console.log("Something went wrong while getting videos", e);
    res.status(500).json({
      message: "Something went wrong while getting videos",
    });
  }
};

export const getVideoDetails = async (req, res) => {
  try {
    const video = await db.query("SELECT * FROM video WHERE id=$1", [
      req.params.id,
    ]);

    if (video.rows.length === 0)
      return res.status(404).json({ message: "Video not found" });
    const q = await db.query(
      "SELECT v.*, (SELECT EXISTS (SELECT 1 FROM subscriptions as s WHERE v.channelId = s.channelId AND s.subscriberId = $2 )) as subscribedByMe,  (SELECT liked FROM likes WHERE likes.userId = $2 AND likes.videoId = $1) as likedByMe, (SELECT COUNT(*) FROM subscriptions as s WHERE s.channelId=v.channelId) AS subscribeCount, (SELECT COUNT(*) FROM likes as l WHERE l.videoId=v.id AND l.likeValue = 1) AS likedCount,(SELECT COUNT(*) FROM likes as l WHERE l.videoId=v.id AND l.likeValue = 0) AS dislikeCount , c.id AS channelId, name as channelName, c.img as channelImage FROM video as v INNER JOIN channels AS c ON (c.id = v.channelId)  LEFT JOIN likes AS l ON (l.videoId = v.id)  WHERE v.id = $1",
      [req.params.id, req.user]
    );
    console.log("hey the q second here is", q);
    if (q.rows.length > 0) {
      await db.query(
        "UPDATE video SET videoViews = videoViews + 1 WHERE id = $1",
        [req.params.id]
      );
      console.log("the video details is", q.rows[0]);
      return res.status(200).json({
        message: "Video details fetched successfully",
        video: q.rows[0],
      });
    }
  } catch (e) {
    console.log("Something went wrong while getting video details", e);
    res.status(500).json({
      message: "Something went wrong while getting video details",
    });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT * FROM likes WHERE userId = $1 AND videoId = $2",
      [req.user, req.params.id]
    );
    if (q.rows.length === 0) {
      const q = await db.query(
        "INSERT INTO likes (videoId, userId, likeValue, liked) VALUES ($1, $2, $3, $4) returning *",
        [req.params.id, req.user, 1, true]
      );
      return res.status(200).json({
        message: "Video liked successfully",
        likes: q.rows[0],
      });
    } else {
      const q = await db.query(
        "UPDATE likes SET likeValue = 1 , liked = true WHERE likes.userId = $1 AND likes.videoId = $2 returning *",
        [req.user, req.params.id]
      );
      return res.status(200).json({
        message: "Video liked successfully",
        likes: q.rows[0],
      });
    }
  } catch (e) {
    console.log("Something went wrong while liking video", e);
    res.status(500).json({
      message: "Something went wrong while liking video",
    });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT * FROM likes WHERE userId = $1 AND videoId = $2",
      [req.user, req.params.id]
    );
    if (q.rows.length === 0) {
      await db.query(
        "INSERT INTO likes (videoId, userId, likeValue, liked) VALUES ($1, $2, $3, $4)",
        [req.params.id, req.user, 0, false]
      );
    } else {
      await db.query(
        "UPDATE likes SET likeValue = 0 , liked = false WHERE likes.userId = $1 AND likes.videoId = $2",
        [req.user, req.params.id]
      );
    }
    res.status(200).json({
      message: "Video disliked successfully",
    });
  } catch (e) {
    console.log("Something went wrong while disliking video", e);
    res.status(500).json({
      message: "Something went wrong while disliking video",
    });
  }
};
