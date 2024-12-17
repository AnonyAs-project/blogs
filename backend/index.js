require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routers/index");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successfully to database");
  })
  .catch((err) => {
    console.error(`Error connecting to database ${err}`);
  });
app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT}`);
});
