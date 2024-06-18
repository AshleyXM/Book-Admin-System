import express, { Request, Response } from "express";
import { User } from "../models";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constant";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, name, status } = req.query;
  const data = await User.find({
    ...(name && { name }),
    ...(status && { status }),
  })
    .skip((Number(current) - 1) * Number(pageSize)) // 跳过前(current - 1)页的数据
    .limit(Number(pageSize)); // 最多取pageSize个数据
  const total = await User.countDocuments({
    ...(name && { name }),
    ...(status && { status }),
  }); // 计算总数据量
  return res.status(200).json({ data, total });
});

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const user = new User({ ...body });
  user.save();
  return res.json({ success: true });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json({ data: user, success: true });
  } else {
    res.status(500).json({ message: "The user does not exist!!" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  await User.findOneAndUpdate({ _id: id }, { ...body, updatedAt: Date.now() });
  return res.status(200).json({ success: true });
});

router.post("/login", async (req: Request, res: Response) => {
  const { account, password } = req.body;
  const user = await User.findOne({ account, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ data: user, success: true, token });
  } else {
    res.json({ success: false, message: "Username or password incorrect!" });
  }
});

export default router;
