import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { name, email, password, img } = req.body;
  try {
    const q = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (q.rows.length > 0) {
      return res.status(400).json({
        message: "User with that email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const q1 = await db.query(
      "INSERT INTO users(name, email, password, img) VALUES($1, $2, $3, $4)",
      [name, email, hashedPassword, img]
    );
    res.status(200).json({
      message: "User registered successfully",
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
    const q = await db.query("SELECT * FROM users WHERE email =$1", [email]);
    if (q.rows.length > 0) {
      const user = q.rows[0];

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        console.log("hey password incorrect");
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }
      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        "secret-key",
        {
          expiresIn: "10m",
        }
      );
      const refreshToken = jwt.sign(
        {
          id: user.id,
        },
        "secret-key",
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
      return res.status(200).json({
        accessToken,
        users: others,
      });
    } else {
      return res.status(400).json({
        message: "User with that email doesn't exist",
      });
    }
  } catch (e) {
    console.log(e);
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
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong.Please try again",
    });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      jwt.verify(refreshToken, "secret-key", async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Invalid token",
          });
        }
        const accessToken = jwt.sign({ id: decoded.id }, "secre-key", {
          expiresIn: "10m",
        });
        const foundUser = await db.query("SELECT * FROM users WHERE id = $1", [
          decoded.id,
        ]);
        if (foundUser.rows.length <= 0) {
          return res.status(401).json({
            message: "User not found",
          });
        }
        const { password, ...others } = foundUser.rows[0];
        if (foundUser.rows.length > 0) {
          return res.status(200).json({
            accessToken,
            user: others,
          });
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong.Please try again",
      });
    }
  }
};
