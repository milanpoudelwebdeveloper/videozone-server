import db from "../db/index.js";

export const getAllComments = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT c.*, ch.name as channelName, ch.img as channelImage FROM comments as c INNER JOIN channels as ch ON (ch.id = c.id) WHERE c.videoId = $1  ORDER BY c.id DESC",
      [req.params.videoId]
    );
    res.status(200).json({
      message: "All comments fetched successfully",
      comments: q.rows,
    });
  } catch (e) {
    console.log("Something went wrong while getting all comments", e);
    res.status(500).json({
      message: "Something went wrong while getting all comments",
    });
  }
};

export const postComment = async (req, res) => {
  console.log("the user is", req.user);
  try {
    const q = await db.query(
      "INSERT INTO comments (videoId, userId, comment ) VALUES ($1, $2, $3) returning *",
      [req.params.videoId, req.user, req.body.comment]
    );
    if (q.rows.length > 0) {
      const q1 = await db.query(
        "SELECT name as channelName, img as channelImage, id as channelId FROM channels WHERE id = $1",
        [q.rows[0].userId]
      );
      return res.status(200).json({
        message: "Comment posted successfully",
        newComment: { ...q.rows[0], ...q1.rows[0] },
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong while posting comment",
      });
    }
  } catch (e) {
    console.log("Something went wrong while posting comment", e);
    res.status(500).json({
      message: "Something went wrong while posting comment",
    });
  }
};
