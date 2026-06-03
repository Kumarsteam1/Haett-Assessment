import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PartnerApplication",
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    discountValue: {
      type: Number,
      default: 20,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    totalDiscountGiven: {
      type: Number,
      default: 0,
    },

    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DiscountCode",
  discountCodeSchema
);