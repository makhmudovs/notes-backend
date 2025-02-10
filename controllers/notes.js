const notesRouter = require('express').Router();
const Note = require('../models/note');

//get all the notes
notesRouter.get('/',async (req, res) => {
    const notes = await Note.find({});
    res.json(notes);
});

// get a specific note by an id
notesRouter.get('/:id', async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});


//post new note
notesRouter.post('/', async (req, res, next) => {
    const body = req.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    try {
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch(exception) {
        next(exception);
    }
});


//delete a note by and id
notesRouter.delete('/:id', async (req, res, next) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (exception) {
        next(exception);
    }
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