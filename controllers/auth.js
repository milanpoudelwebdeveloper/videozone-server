import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { name, email, password, img } = req.body;
  try {
    const q = await db.query("SELECT * FROM channels WHERE email = $1", [
      email,
    ]);
    if (q.rows.length > 0) {
      return res.status(400).json({
        message: "User/channel with that email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await db.query(
      "INSERT INTO channels(name, email, password, img) VALUES($1, $2, $3, $4)",
      [name, email, hashedPassword, img]
    );
    res.status(200).json({
      message: "User/Channel registered successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong while creating account.Please try again",
    });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    const q = await db.query("SELECT * FROM channels WHERE email=$1", [email]);
    console.log("hey user is", q.rows[0]);
    if (q.rows.length > 0) {
      console.log("started running here");
      const user = q.rows[0];

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }
      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.REFRESH_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      const { password, ...others } = user;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      console.log("cookies set success");
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        message: "Logged in successfully",
        user: others,
      });
    } else {
      res.status(400).json({
        message: "User/Channel with that email doesn't exist",
      });
    }
  } catch (e) {
    console.log("Error while logging in", e);
    res.status(500).json({
      message: "Something went wrong while logging in.Please try again",
    });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong.Please try again",
    });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({
              message: "Invalid token/not logged in",
            });
          }
          const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_SECRET_KEY,
            {
              expiresIn: "10m",
            }
          );
          const foundUser = await db.query(
            "SELECT * FROM channels WHERE id = $1",
            [decoded.id]
          );
          if (foundUser.rows.length <= 0) {
            return res.status(400).json({
              message: "User/Channel not found",
            });
          }
          const { password, ...others } = foundUser.rows[0];
          if (foundUser.rows.length > 0) {
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
            });
            return res.status(200).json({
              user: others,
            });
          }
        }
      );
    } else {
      return res.status(403).json({
        message: "Invalid token/not logged in",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong.Please try again",
    });
  }
};
