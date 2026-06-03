import PartnerApplication from "../models/PartnerApplication.js";
import DiscountCode from "../models/DiscountCode.js";
import User from "../models/User.js";

// GET /api/admin/applications?status=pending
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const applications = await PartnerApplication.find(filter)
      .populate("userId", "name email")
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/admin/applications/:id/approve
export const approveApplication = async (req, res) => {
  try {
    const application = await PartnerApplication.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = "approved";
    application.approvedAt = new Date();
    await application.save();

    // Auto-generate a discount code
    const code =
      "HAETT-" +
      Math.random().toString(36).toUpperCase().slice(2, 8);

    const discountCode = await DiscountCode.create({
      partnerId: application._id,
      code,
      discountType: "percentage",
      discountValue: 20,
    });

    res.json({
      success: true,
      application,
      discountCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/admin/applications/:id/reject
export const rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const application = await PartnerApplication.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = "rejected";
    application.rejectionReason = reason;
    await application.save();

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/admin/applications/:id/codes
export const getPartnerCodes = async (req, res) => {
  try {
    const codes = await DiscountCode.find({
      partnerId: req.params.id,
    });

    res.json({
      success: true,
      codes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/admin/codes/:codeId/toggle
export const toggleCode = async (req, res) => {
  try {
    const code = await DiscountCode.findById(req.params.codeId);

    if (!code) {
      return res.status(404).json({
        success: false,
        message: "Discount code not found",
      });
    }

    code.isActive = !code.isActive;
    await code.save();

    res.json({
      success: true,
      code,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};