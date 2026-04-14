const express = require("express");
const router = express.Router();
const File = require("../models/File");


// GET all files of a project
router.get("/files/:projectId", async (req, res) => {

  try {

    const files = await File.find({
      projectId: req.params.projectId
    });

    res.json(files);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }

});


// OPEN a file
router.get("/files/open/:id", async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to open file" });
  }

});


// SAVE file content
router.post("/files/save/:id", async (req, res) => {

  try {

    const { content } = req.body;

    const file = await File.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );

    res.json(file);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save file" });
  }

});


module.exports = router;
