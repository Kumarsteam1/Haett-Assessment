import express from "express";
import {
  applyAsPartner,
  getMyApplication,
  getMyCodes,
} from "../controllers/partnerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyAsPartner);
router.get("/my-application", protect, getMyApplication);
router.get("/my-codes", protect, getMyCodes);

export default router;