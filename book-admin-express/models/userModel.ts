import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  account: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
  },
  sex: {
    type: String,
  },
  role: {
    type: String,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
});

export default UserSchema;
