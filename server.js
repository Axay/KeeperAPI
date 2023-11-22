const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const pass = encodeURIComponent(process.env.PASS);
const user = process.env.USER;

var db1 = mongoose.connect(
  "mongodb+srv://" +
    user +
    ":" +
    pass +
    "@cluster0.v0qezj7.mongodb.net/keeperDB?retryWrites=true&w=majority"
);
var db = mongoose.connection;

const keeperSchema = {
  title: String,
  content: String,
};

const Keeper = mongoose.model("Keeper", keeperSchema);

app.get("/api/getAll", (req, res) => {
  Keeper.find({}).then(function (KeeperList) {
    res.send(KeeperList);
  });
});

app.post("/api/addNew", (req, res) => {
  const { title, content } = req.body;
  const keeperObj = new Keeper({
    title: title,
    content: content,
  });
  keeperObj.save();
  res.redirect("/api/getAll");
});

app.post("/api/delete", (req, res) => {
  const { id } = req.body;
  Keeper.deleteOne({ _id: id }).then(function () {
    res.redirect("/api/getAll");
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("backend created at port 5000");
});
