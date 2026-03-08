import mongoose from "mongoose";
import slugify from "../../utils/slugify.js";

const { Schema } = mongoose;

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  { _id: false },
);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    image: {
      type: String,
    },

    icon: {
      type: String,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    seo: seoSchema,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({
  name: "text",
  description: "text",
});

categorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
