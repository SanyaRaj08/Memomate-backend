const mongoose = require("mongoose");
const {Schema}=mongoose;

const NotesSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    default:"general"
  },
  date: {
    type: Date,
    default: Date.mow,
  }
});

module.exports = mongoose.model("notes", NotesSchema);
