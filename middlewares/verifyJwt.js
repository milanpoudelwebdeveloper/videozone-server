import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return res.status(403).json({
        message: "Not authenticated, no token provided",
      });
    jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err)
        return res.status(401).json({
          message: "Not logged in, invalid token",
        });
      req.user = decoded.id;
      next();
    });
  } catch (e) {
    console.log("something went wrong while verifying jwt", e);
    res
      .status(500)
      .json({ message: "Something went wrong while verifying jwt" });
  }
};

export const unAuthVerify = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return next();
    jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        return next();
      }
      if (decoded.id) {
        req.user = decoded.id;
      }
      next();
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong while verifying jwt" });
  }
};
