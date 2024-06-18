import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "on",
  },
  loanedAt: {
    type: Number,
    default: Date.now,
  },
  returnedAt: {
    type: Number,
    default: 0,
  },
});

export default LoanSchema;
