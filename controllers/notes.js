const notesRouter = require('express').Router();
const Note = require('../models/note');

//get all the notes
notesRouter.get('/', (req, res,next) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    }).catch(err => next(err));
});

// get a specific note by an id
notesRouter.get('/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => next(err));
});


//post new note
notesRouter.post('/', (req, res, next) => {
    const body = req.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save()
        .then((savedNote) => {
            res.json(savedNote);
        }).catch((err) => next(err));
});


//delete a note by and id
notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});


//update a note
notesRouter.put('/:id', (req, res, next) => {
    const { content, important } = req.body;

    Note.findByIdAndUpdate(
        req.params.id,
        {
            content,
            important,
        },
        { new: true, runValidators: true, context: 'query' }
    )
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((err) => next(err));
});


module.exports = notesRouter;