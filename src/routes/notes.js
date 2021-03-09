const router = require("express").Router();
const Note = require("../models/Note");
const { isAuthenticated } = require('../helpers/auth');

router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/new-note.hbs");
});

router.post("/notes/new", isAuthenticated, async (req, res) => {
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
      newNote.user = req.user.id;
      await newNote.save();
      req.flash('success_msg', 'Note created successfully');
      res.redirect("/notes");
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/notes", isAuthenticated, async (req, res) => {
  await Note.find({user: req.user.id}).sort({date: 'desc'}).then((documentos) => {
    const contexto = {
      notes: documentos.map((documento) => {
        return {
          _id: documento._id,
          title: documento.title,
          description: documento.description,
          date: documento.date,
          user: documento.user
        };
      }),
    };
    res.render("notes/all-notes.hbs", {
      notes: contexto.notes,
    });
  });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await Note.findById(id)
    .then(documento => {
      const contexto = {
        note: {
          _id: documento._id,
          title: documento.title,
          description: documento.description,
          date: documento.date,
        },
      };
      res.render('notes/edit-note.hbs', {
        note: contexto.note
      });
    })
    .catch(err => {
      console.error(err);
    });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  await Note.findByIdAndUpdate(id, { title, description });
  req.flash('success_msg', 'Note updated successfully');
  res.redirect('/notes');
});

router.get('/notes/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  req.flash('success_msg', 'Note deleted successfully');
  res.redirect('/notes');
})

module.exports = router;
