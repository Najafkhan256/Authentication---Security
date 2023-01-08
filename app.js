//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));
mongoose.set("strictQuery", true);

// Connecting DataBase
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// userSchema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// user model and collection
const User = new mongoose.model("User", userSchema);

// Home Route
app.get("/", function(req, res) {
  res.render("home");
});
// Login Route
app.get("/login", function(req, res) {
  res.render("login");
});
// Register Route
app.get("/register", function(req, res) {
  res.render("register");
});

// Register Post Request
app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.useremail,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
});
});
// Login Post Request
app.post("/login", function(req, res) {
  const useremail = req.body.useremail;
  const password = req.body.password

  User.findOne({ email: useremail }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets")
          }else{
            console.log(err);
          }
      });
      
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
