import express, { Request, Response } from "express";
import { Category } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, name, level, all } = req.query;
  const queryParams = {
    ...(name && { name }), // 当name存在的时候，传name属性；否则不指定name属性
    ...(level && { level }),
  };
  let data;
  if (all) {
    data = await Category.find().populate("parent");
  } else {
    data = await Category.find(queryParams)
      .skip((Number(current) - 1) * Number(pageSize)) // 跳过前(current - 1)页的数据
      .populate("parent") // 根据objectid去填充parent字段
      .limit(Number(pageSize)); // 取pageSize个数据
  }

  const total = await Category.countDocuments(queryParams); // 计算总数据量
  return res.status(200).json({ data, total });
});

router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const oldCategory = await Category.findOne({ name });
  if (oldCategory) {
    return res.status(500).json({ message: "The category exists!!" });
  } else {
    const book = new Category({ ...req.body });
    book.save();
    return res.json({ success: true, code: 200 });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Category.findById(id);
  if (book) {
    res.status(200).json({ data: book, success: true });
  } else {
    res.status(500).json({ message: "The category does not exist!!" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  await Category.findOneAndUpdate(
    { _id: id },
    { ...body, updatedAt: Date.now() }
  );
  return res.status(200).json({ success: true });
});

export default router;
