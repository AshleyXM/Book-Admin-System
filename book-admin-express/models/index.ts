import mongoose from "mongoose";
import UserSchema from "./userModel";
import BookSchema from "./bookModel";
import CategorySchema from "./categoryModel";
import LoanSchema from "./loanModel";

const uri =
  "mongodb+srv://<username>:<password>@cluster0.pesd53q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  mongoose.connect(uri);
}

run()
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const User = mongoose.model("User", UserSchema); // 根据定义的schema创建一个collection
const Book = mongoose.model("Book", BookSchema);
const Category = mongoose.model("Category", CategorySchema);
const Loan = mongoose.model("Loan", LoanSchema);
export { User, Book, Category, Loan };
