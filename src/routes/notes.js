const router = require("express").Router();
const Note = require("../models/Note");

router.get("/notes/add", (req, res) => {
  res.render("notes/new-note.hbs");
});

router.post("/notes/new", async (req, res) => {
  try {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
      errors.push({ text: "Please write a title" });
    }
    if (!description) {
      errors.push({ text: "Please write a description" });
    }
    if (errors.length > 0) {
      res.render("notes/new-note.hbs", {
        errors,
        title,
        description,
      });
    } else {
      const newNote = new Note({ title, description });
      await newNote.save();
      res.redirect("/notes");
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/notes", async (req, res) => {
  await Note.find().sort({date: 'desc'}).then((documentos) => {
    const contexto = {
      notes: documentos.map((documento) => {
        return {
          title: documento.title,
          description: documento.description,
        };
      }),
    };
    res.render("notes/all-notes.hbs", {
      notes: contexto.notes,
    });
  });
});

module.exports = router;
