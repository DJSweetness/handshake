const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let chirp = new Schema({
  text: {
    type: String
  }, 
  upvotes: Number
});

module.exports = mongoose.model("chirp", chirp);