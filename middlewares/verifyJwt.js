import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!token)
      return res.status(401).json({
        message: "Not authenticated",
      });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret-key", (err, decoded) => {
      if (err)
        return res.status(403).json({
          message: "Forbidden, invalid token",
        });
      req.user = decoded.id;
      next();
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong while verifying jwt" });
  }
};
