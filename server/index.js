const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/database-tutorial"; 

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

const app = express();
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

var router = express.Router();

const Schema = mongoose.Schema;

const image = new Schema({
  date: String,
  image_url: String,
});

const Images = mongoose.model("Images", image);

// The method of the root url. Be friendly and welcome our user :)
router.get("/", function (req, res) {
  res.json({ message: "Welcome to the APOD app." });
});

router.get("/favorite", function (req, res) {
  Images.find().then((results) => { //call back func. images.find() returns "promise". takes time to get results from promise. .then() is for that. 
    res.json({ results });
  });
});

router.post("/add", function (req, res) {
  const url = req.body.image_url;
  const date = req.body.date;
  const newImage = new Images({
    date: date,
    image_url: url,
  })
  newImage.save((error, doc) => {
    if (error) {
      res.json({ status: "Fail" });
    } else {
      res.json({ //just send date image back
        date: date,
        image_url: url,
      });
    }
  });
  //res.json({ message: "TODO: Here's the add route" });
});

router.delete("/delete", function (req, res) {
  const date = req.body.date;
  Images.findOneAndDelete({ date: date }).then(() => {
    res.json({ message: "delete success" });
  });
    
});

app.use("/api", router); // API Root url at: http://localhost:8080/api

app.listen(port);
console.log("Server listenning on port " + port);
