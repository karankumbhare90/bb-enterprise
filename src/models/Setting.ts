import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    siteLogo: {
      type: String,
      default: "",
    },
    cloudinaryId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "BB Enterprise",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    contactMobile: {
      type: String,
      default: "",
    },
    contactAddress: {
      type: String,
      default: "",
    },
    googleMapLink: {
      type: String,
      default: "",
    },
    socialIcons: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    awards: [
      {
        heading: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

delete mongoose.models.Setting;
const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export default Setting;
