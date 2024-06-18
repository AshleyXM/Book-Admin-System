import express, { Request, Response } from "express";
import { Book, Loan } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, book, status, user, all } = req.query;
  const queryParams = {
    ...(book && { book }), // 当name存在的时候，传name属性；否则不指定name属性
    ...(status && { status }),
    ...(user && { user }),
  };
  let data;
  if (all) {
    data = await Loan.find().populate("book").populate("user");
  } else {
    data = await Loan.find(queryParams)
      .skip((Number(current) - 1) * Number(pageSize)) // 跳过前(current - 1)页的数据
      .populate("book")
      .populate("user")
      .limit(Number(pageSize)); // 最多取pageSize个数据
  }

  const total = await Loan.countDocuments(queryParams); // 计算总数据量
  return res.status(200).json({ data, total });
});

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const loan = new Loan({ ...body });
  await loan.save();
  await Book.findOneAndUpdate({ _id: body?.book }, { $inc: { stock: -1 } });
  return res.json({ success: true });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Loan.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

router.put("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  const loan = await Loan.findById(id);
  if (loan) {
    await loan.updateOne(body);
    await Book.findOneAndUpdate(
      { _id: loan?.book?._id },
      { $inc: { stock: 1 } }
    );
    return res.status(200).json({ success: true });
  }
  res.status(500).json({ success: false });
});

export default router;
