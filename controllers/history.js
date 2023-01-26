import db from "../db/index.js";
import moment from "moment";

export const getHistory = async (req, res) => {
  let time = req.params.filter;
  let q = "";
  if (time === "today") {
    q =
      "date_trunc('day', history.createdAt) = date_trunc('day', CURRENT_DATE)";
  } else if (time === "yesterday") {
    q =
      "date_trunc('day', history.createdAt) = date_trunc('day', CURRENT_DATE - INTERVAL '1 day')";
  } else if (time === "thisweek") {
    q =
      "date_trunc('day', history.createdAt) > date_trunc('day', CURRENT_DATE - INTERVAL '7 day')";
  } else if (time === "thismonth") {
    q =
      "date_trunc('day', history.createdAt) > date_trunc('day', CURRENT_DATE - INTERVAL '30 day')";
  } else if (time === "older") {
    q =
      "date_trunc('day', history.createdAt) < date_trunc('day', CURRENT_DATE - INTERVAL '30 day')";
  } else if (time === "all") {
    q = "true";
  }

  try {
    const q1 = await db.query(
      `SELECT v.id, v.title,v.createdAt as createdAt, v.videoViews, v.descp, v.thumbnail, c.name as channelName, history.createdAt as watchedDate
      FROM history
      JOIN video as v ON history.videoId = v.id
      JOIN channels as c ON v.channelId = c.id
      WHERE userId = $1 AND ${q}
      ORDER BY history.createdAt DESC LIMIT 6`,
      [req.user]
    );
    if (q1.rows.length <= 0) {
      return res.status(200).json({
        message: "No history found",
        history: [],
      });
    } else {
      return res.status(200).json({
        message: "History fetched successfully",
        history: q1.rows,
      });
    }
  } catch (e) {
    console.log("Something went wrong while getting history", e);
    res
      .status(500)
      .json({ message: "Something went wrong while getting history" });
  }
};

export const addToHistory = async (req, res) => {
  try {
    const q = await db.query(
      "SELECT * FROM history WHERE videoId = $1 AND userId = $2",
      [req.params.videoId, req.user]
    );
    if (q.rows.length === 0) {
      await db.query("INSERT INTO history (userId, videoId) VALUES ($1, $2)", [
        req.user,
        req.params.videoId,
      ]);
      return res.status(200).json({
        message: "Added to history",
      });
    } else {
      let video = q.rows[0];
      let lastWatched = moment(video?.createdAt);
      let curretTime = moment();
      let diff = moment.duration(curretTime.diff(lastWatched));
      let days = diff.asDays();
      if (days > 1) {
        await db.query(
          "INSERT INTO history (userId, videoId) VALUES ($1, $2)",
          [req.user, req.params.videoId]
        );
        return res.status(200).json({
          message: "Added to history",
        });
      } else {
        return res.status(200).json({
          message: "Already in history",
        });
      }
    }
  } catch (e) {
    console.log("Something went wrong while adding to history", e);
    res
      .status(500)
      .json({ message: "Something went wrong while adding to history" });
  }
};
