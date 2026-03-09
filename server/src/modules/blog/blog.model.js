import generateUniqueSlug from "../../utils/generateUniqueSlug.js";
import mongoose from "mongoose";

const { Schema } = mongoose;

const contentBlockSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "paragraph",
        "heading",
        "image",
        "video",
        "code",
        "quote",
        "table",
        "list",
      ],
      required: true,
    },

    text: {
      type: String,
      trim: true,
    },

    level: {
      type: Number,
    },

    url: {
      type: String,
    },

    caption: {
      type: String,
      trim: true,
    },

    language: {
      type: String,
    },

    items: {
      type: [String],
    },
  },
  { _id: false },
);

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

    keywords: [String],
  },
  { _id: false },
);

const revisionSchema = new Schema(
  {
    title: String,

    content: [contentBlockSchema],

    editedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    editedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    coverImage: {
      type: String,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    content: {
      type: [contentBlockSchema],
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
      index: true,
    },

    seo: seoSchema,

    views: {
      type: Number,
      default: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    revisions: [revisionSchema],

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

blogSchema.index({
  title: "text",
  excerpt: "text",
  tags: "text",
});

blogSchema.pre("save", async function () {
  if (!this.slug || this.isModified("title")) {
    const Blog = mongoose.model("Blog");
    this.slug = await generateUniqueSlug(Blog, this.title);
  }

  if (this.isModified("content")) {
    const textContent = this.content.map((block) => block.text || "").join(" ");

    const words = textContent.trim().split(/\s+/).length;

    this.readTime = Math.ceil(words / 200) || 1;
  }
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
