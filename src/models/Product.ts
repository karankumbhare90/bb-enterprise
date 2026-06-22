import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Active",
    },
    tradeType: {
      type: String,
      enum: ["Export", "Import"],
      default: "Export",
    },
    description: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        cloudinaryId: {
          type: String,
          required: true,
        },
      },
    ],
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: 0,
    },
    moq: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: "Units",
    },
    technicalParameters: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    packagingLogistics: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      }
    ],
  },
  { timestamps: true }
);

delete mongoose.models.Product;
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
