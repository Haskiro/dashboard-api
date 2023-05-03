import express from "express";

const port = 8000;
const app = express();

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.get("/hello", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-type", "text/plain");
  res.send("Привет!");
});
