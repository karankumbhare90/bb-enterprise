import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // Cloudinary secure URL
    },
    cloudinaryId: {
      type: String, // Public ID to delete it later
    },
    status: {
      type: String,
      default: "Active",
    },
    parentCategory: {
      type: String,
      default: "",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", async function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

delete mongoose.models.Category;
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
