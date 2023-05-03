import express from "express";

const port = 8000;
const app = express();

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.all("/hello", (req, res, next) => {
  console.log("all");
  next();
});

const cb = (req, res, next) => {
  console.log("CB");
  next();
};

app
  .route("/user/hello")
  .get((req, res) => {
    res.send("Привет!");
  })
  .post((req, res) => {
    res.send("Привет POST!");
  });
