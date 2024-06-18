import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  stock: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
});

export default BookSchema;
