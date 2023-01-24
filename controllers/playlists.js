import db from "../db/index.js";

export const getPlaylists = async (req, res) => {
  try {
    const q = await db.query("SELECT * FROM playlists WHERE channelId = $1", [
      req.params.channelId,
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

export const createPlaylist = async (req, res) => {
  try {
    const q = await db.query(
      "INSERT INTO playlists (channelId, title, private) VALUES ($1, $2, $3) RETURNING *",
      [req.user, req.body.title, req.body.privacy]
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
    await db.query(
      "INSERT INTO playlistVideo (playlistId, videoId) VALUES ($1, $2)",
      [req.params.playlistId, req.body.videoId]
    );
    if (req.body.thumbnail) {
      await db.query("UPDATE playlists SET thumbnail = $1 WHERE id = $2", [
        req.body.thumbnail,
        req.params.playlistId,
      ]);
    }
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

export const getVideoPlaylists = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT p.* FROM playlists p LEFT JOIN playlistVideo pv ON pv.playlistId= p.id WHERE p.channelId = $1 AND pv.videoId = $2",
      [req.user, req.params.videoId]
    );
    res.status(200).json({
      message: "Playlists of a video fetched successfully",
      playlists: q.rows,
    });
  } catch (e) {
    console.log("Something went wrong while getting video playlists", e);
    res.status(500).json({
      message: "Something went wrong while getting video playlists",
    });
  }
};

export const deleteFromPlaylist = async (req, res) => {
  console.log("the playlists id is", req.params.playlistId);
  console.log("the video id is", req.body.videoId);
  try {
    await db.query(
      "DELETE FROM playlistVideo WHERE playlistId = $1 AND videoId = $2",
      [req.params.playlistId, req.body.videoId]
    );
    res.status(200).json({
      message: "Video deleted from playlist successfully",
    });
  } catch (e) {
    console.log("Something went wrong while deleting from playlists", e);
    res.status(500).json({
      message: "Something went wrong while deleting from playlist",
    });
  }
};

export const getPlayListVideos = async (req, res) => {
  console.log("the params coming is", req.params.playlistId);
  try {
    const q = await db.query(
      "SELECT *, title , thumbnail FROM playlistVideo as pv JOIN video v ON v.id = pv.videoId WHERE playlistId = $1 ",
      [req.params.playlistId]
    );
    res.status(200).json({
      message: "Videos of a playlist fetched successfully",
      videos: q.rows,
    });
  } catch (e) {
    console.log("Something went wrong while getting videos of a playlist", e);
    res.status(500).json({
      message: "Something went wrong while getting videos of a playlist",
    });
  }
};
