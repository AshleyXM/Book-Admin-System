import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import BookRouter from "./routes/book";
import CategoryRouter from "./routes/category";
import UserRouter from "./routes/user";
import LoanRouter from "./routes/loan";

import express, { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import { SECRET_KEY } from "./constant";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 确保 express-jwt 中间件在所有需要保护的路由之前被加载
// 如果有其他中间件或路由在 express-jwt 之前被加载，可能会导致这些路由绕过 JWT 验证
app.use(
  expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }).unless({
    path: ["/api/users/login"],
  })
);

// 这些中间件必须写在expressjwt之后
app.use("/api/books", BookRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/users", UserRouter);
app.use("/api/loans", LoanRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.listen("3005", () => {
  console.log("Server started at port 3005");
});

module.exports = app;
