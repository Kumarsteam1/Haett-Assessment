import mongoose from "mongoose";

const partnerApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    partnerType: {
      type: String,
      enum: [
        "Affiliate",
        "Influencer",
        "Gym",
        "Corporate",
        "Partner Associate",
      ],
      required: true,
    },

    businessName: {
      type: String,
      required: true,
    },

    contactPhone: String,

    socialLink: String,

    audienceSize: Number,

    description: {
      type: String,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PartnerApplication",
  partnerApplicationSchema
);