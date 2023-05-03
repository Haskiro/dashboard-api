import express from "express";
import { userRouter } from "./users/users.js";

const port = 8000;
const app = express();

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.use("/users", userRouter);

app.get("/hello", (req, res) => {
  res.send("Привет");
});
