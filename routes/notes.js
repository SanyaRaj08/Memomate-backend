const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");
const mongoose = require("mongoose");
//get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



//add a new note
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("content", "Enter a valid content").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, content, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        content,
        tag,
        user: req.user.id,
      });
      const savedNotes = await notes.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//UPDATE AN EXISTING NOTE-LOGIN REQUIRED

router.put(
    "/updatenotes/:id",
    fetchuser,
    async (req, res) => {
      const { title, content, tags } = req.body;
      // Create new note object
      const newNote = {};
  
      if (title) {
        newNote.title = title;
      }
      if (content) {
        newNote.content = content;
      }
      if (tags) {
        newNote.tags = tags;
      }
  
      try {
        // Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
          return res.status(404).send("Note not found");
        }
        
        // Check if the user is authorized to update the note
        if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Unauthorized user");
        }
        
        // Update the note
        note = await Notes.findByIdAndUpdate(
          req.params.id,
          { $set: newNote },
          { new: true }
        );
        res.json({ note });
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    }
  );

//DELETE EXISTING NOTES

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }

    // Check if the user is authorized to delete the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Unauthorized user");
    }

    // Delete the note
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
