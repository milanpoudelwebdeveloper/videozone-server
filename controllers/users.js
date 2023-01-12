import db from "../db/index.js";

export const updateUser = async (req, res) => {
  const { img, name } = req;
  if (req.params.id === req.user) {
    try {
      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        req.user,
      ]);
      if (user.rows.length <= 0)
        return res.status(404).json({ message: "User not found" });
      const updatedUser = await db.query(
        "UPDATE users SET name = $1, img = $2 WHERE id = $3 RETURNING *",
        [name, img, req.id]
      );
      const { password, ...rest } = updatedUser.rows[0];
      res.status(200).json({
        message: "User update successfully",
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
