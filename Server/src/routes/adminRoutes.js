import express from "express";
import {
  getAllApplications,
  approveApplication,
  rejectApplication,
  getPartnerCodes,
  toggleCode,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes need protect + adminOnly
router.use(protect, adminOnly);

router.get("/applications", getAllApplications);
router.post("/applications/:id/approve", approveApplication);
router.post("/applications/:id/reject", rejectApplication);
router.get("/applications/:id/codes", getPartnerCodes);
router.patch("/codes/:codeId/toggle", toggleCode);

export default router;