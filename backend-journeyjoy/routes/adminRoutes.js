// backend/routes/adminRoutes.js
import { Router } from "express";
import adminCheck from "../middleware/adminCheck.js";

const router = Router();

router.get("/", adminCheck, (req, res) => {
  res.send("Admin route");
});

export default router;
