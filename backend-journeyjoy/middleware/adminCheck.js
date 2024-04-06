// backend/middleware/adminCheck.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config/envConfig.js";

const adminCheck = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // jwt의 payload에 접근해서 req.user에 할당

    // userId를 사용하여 데이터베이스에서 사용자 조회
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // 사용자의 role이 admin인지 확인
    if (user.role === "admin") {
      next(); // 다음 미들웨어로 진행
    } else {
      res.status(403).send("Access denied. Admins only.");
    }
  } catch (error) {
    res.status(403).send("Invalid token.");
  }
};

export default adminCheck;
