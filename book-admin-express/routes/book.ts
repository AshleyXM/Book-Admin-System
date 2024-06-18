import express, { Request, Response } from "express";
import { Book } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, name, author, category, all } = req.query;
  const queryParams = {
    ...(name && { name }), // 当name存在的时候，传name属性；否则不指定name属性
    ...(author && { author }),
    ...(category && { category }),
  };
  let data;
  if (all) {
    data = await Book.find().populate("category");
  } else {
    data = await Book.find(queryParams)
      .skip((Number(current) - 1) * Number(pageSize)) // 跳过前(current - 1)页的数据
      .populate("category") // 填充category字段
      .limit(Number(pageSize)); // 最多取pageSize个数据
  }

  const total = await Book.countDocuments(queryParams); // 计算总数据量
  return res.status(200).json({ data, total });
});

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const book = new Book({ ...body });
  await book.save();
  return res.json({ success: true });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate("category");
  if (book) {
    res.status(200).json({ data: book, success: true });
  } else {
    res.status(500).json({ message: "The book does not exist!!" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  await Book.findOneAndUpdate({ _id: id }, { ...body, updatedAt: Date.now() });
  return res.status(200).json({ success: true });
});

export default router;
