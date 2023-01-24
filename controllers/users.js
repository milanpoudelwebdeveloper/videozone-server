import db from "../db/index.js";

export const updateUser = async (req, res) => {
  const { img, name } = req;
  if (req.params.id === req.user) {
    try {
      const user = await db.query("SELECT * FROM channels WHERE id = $1", [
        req.user,
      ]);
      if (user.rows.length <= 0)
        return res.status(404).json({ message: "User/channel not found" });
      const updatedUser = await db.query(
        "UPDATE channels SET name = $1, img = $2 WHERE id = $3 RETURNING *",
        [name, img, req.user]
      );
      const { password, ...rest } = updatedUser.rows[0];
      res.status(200).json({
        message: "User/channel updated successfully",
        user: rest,
      });
    } catch (e) {
      console.log("Somethigng went wrong while updating user", e);
      res.status(500).json({
        message: "Something went wrong while updating user",
      });
    }
  }
};

export const subscribe = async (req, res) => {
  try {
    const q = await db.query(
      "INSERT INTO subscriptions(subscriberId, channelId) VALUES($1, $2) returning *",
      [req.user, req.params.id]
    );
    if (q.rows.length > 0) {
      res.status(200).json({
        message: "Subscribed successfully",
      });
    }
  } catch (e) {
    console.log("Something went wrong while subscribing", e);
    res.status(500).json({
      message: "Something went wrong while subscribing",
    });
  }
};

export const unSubscribe = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM subscriptions WHERE subscriberId = $1 AND channelId = $2",
      [req.user, req.params.id]
    );
    res.status(200).json({
      message: "Unsubscribed successfully",
    });
  } catch (e) {
    console.log("Something went wrong while unsubscribing", e);
    res.status(500).json({
      message: "Something went wrong while unsubscribing",
    });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT s.*, c.id as channelId, c.name as channelName, description, c.img as channelImage, (SELECT COUNT(*) FROM video as v WHERE v.channelId = s.channelId) as videosCount,(SELECT COUNT(*) FROM subscriptions as su  WHERE su.channelId = s.channelId) as subscribersCount FROM subscriptions as s JOIN channels as c ON c.id = s.channelId WHERE  s.subscriberId = $1 AND s.channelId != $1;",
      [req.user]
    );
    res.status(200).json({
      message: "Subscriptions fetched successfully",
      subscriptions: q.rows,
    });
  } catch (e) {
    console.log("Something went wrong while getting subscriptions", e);
    res.status(500).json({
      message: "Something went wrong while getting subscriptions",
    });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const q = await db.query("SELECT * FROM playlists WHERE channelId = $1", [
      req.user,
    ]);
    res.status(200).json({
      message: "Playlists fetched successfully",
      playlists: q.rows,
    });
  } catch (e) {
    console.log("Something went wrong while getting playlists", e);
    res.status(500).json({
      message: "Something went wrong while getting playlists",
    });
  }
};

export const createPlaylist = async () => {
  try {
    const q = await db.query(
      "INSERT INTO playlists (channelId, title) VALUES ($1, $2)",
      [req.user, req.body.title]
    );
    res.status(200).json({
      message: "Playlist created successfully",
      playlist: q.rows[0],
    });
  } catch (e) {
    console.log("Something went wrong while creating playlists", e);
    res.status(500).json({
      message: "Something went wrong while creating playlist",
    });
  }
};

export const addIntoPlaylist = async (req, res) => {
  try {
    const q = await db.query(
      "INSERT INTO playlistVideo (playlistId, videoId) VALUES ($1, $2)",
      [req.params.id, req.body.videoId]
    );
    res.status(200).json({
      message: "Video added into playlist successfully",
    });
  } catch (e) {
    console.log("Something went wrong while adding into playlists", e);
    res.status(500).json({
      message: "Something went wrong while adding into playlist",
    });
  }
};
