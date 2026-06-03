import PartnerApplication from "../models/PartnerApplication.js";
import DiscountCode from "../models/DiscountCode.js";

// POST /api/partner/apply
export const applyAsPartner = async (req, res) => {
  try {
    const {
      partnerType,
      businessName,
      contactPhone,
      socialLink,
      audienceSize,
      description,
    } = req.body;

    const existing = await PartnerApplication.findOne({
      userId: req.user._id,
    });

    if (existing && existing.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending application",
      });
    }

    if (existing && existing.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "You are already an approved partner",
      });
    }

    // If rejected, allow reapply by updating existing
    if (existing && existing.status === "rejected") {
      existing.partnerType = partnerType;
      existing.businessName = businessName;
      existing.contactPhone = contactPhone;
      existing.socialLink = socialLink;
      existing.audienceSize = audienceSize;
      existing.description = description;
      existing.status = "pending";
      existing.rejectionReason = "";
      existing.appliedAt = new Date();

      await existing.save();

      return res.status(200).json({
        success: true,
        application: existing,
      });
    }

    // Fresh application
    const application = await PartnerApplication.create({
      userId: req.user._id,
      partnerType,
      businessName,
      contactPhone,
      socialLink,
      audienceSize,
      description,
    });

    res.status(201).json({
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

// GET /api/partner/my-application
export const getMyApplication = async (req, res) => {
  try {
    const application = await PartnerApplication.findOne({
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found",
      });
    }

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

// GET /api/partner/my-codes
export const getMyCodes = async (req, res) => {
  try {
    const application = await PartnerApplication.findOne({
      userId: req.user._id,
      status: "approved",
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "You are not an approved partner",
      });
    }

    const codes = await DiscountCode.find({
      partnerId: application._id,
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