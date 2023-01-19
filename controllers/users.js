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
