let Chirp = require("./chirpModel");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
var ObjectID = require('mongodb').ObjectID;
const cors = require("cors");
const PORT = 4000;
app.use(cors());
// app.use(bodyParser);
const router = express.Router();

mongoose.connect("mongodb+srv://admin:T5F7KHtaB5wP3em@cluster0.9z21p.mongodb.net/chirps?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  auth: {
    authdb: 'admin'
  }
});
mongoose.set('useFindAndModify', false);


const connection = mongoose.connection;

connection.once("open", function() {
    console.log("Connection with MongoDB was successful");
});

app.use("/", router);
router.route("/").get(function(req, res) {
    Chirp.find({}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });
});

app.use(express.json());
app.post('/add', async function(req, res) {
  const chirpText = req.body.text;

  try {
    connection.collection('chirps').insertOne({ text: chirpText, upvotes: 0 });
  } catch(e) {
    console.log(e);
  }
});

app.post('/vote', async function(req, res) {
  const chirpText = req.body.text;
  const voteDirection = req.body.voteDirection;
  let countHandler = voteDirection === 'up' ?
    {$inc : {'upvotes' : 1}} :
    {$inc : {'upvotes' : -1}}

  mongoose.set('useFindAndModify', false);

  Chirp.findOneAndUpdate( {text: chirpText}, 
      countHandler, 
      {new: true}, 
      function(err, response) { 
          console.log(err, response);
      });
});

app.post('/delete', async function(req, res) {
  const chirpText = req.body.text;

  try {
    connection.collection('chirps').deleteOne({ text: chirpText});
  } catch(e) {
    console.log(e);
  }
});

app.post('/edit', async function(req, res) {
  const oldChirpText = req.body.oldText;
  const newChirpText = req.body.newText;

  try {
    connection.collection('chirps').deleteOne({ text: chirpText});
  } catch(e) {
    console.log(e);
  }
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});