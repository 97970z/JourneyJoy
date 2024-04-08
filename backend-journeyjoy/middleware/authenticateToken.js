// backend/middleware/authenticateToken.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // 토큰 없음

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403); // 토큰 만료

    try {
      // ObjectID로 유저 찾아서 req.user에 저장
      const user = await User.findById(decoded.userId);
      if (!user) return res.sendStatus(404);
      req.user = { id: user._id.toString(), username: user.username };
      next();
    } catch (error) {
      return res.sendStatus(500);
    }
  });
};

export default authenticateToken;
