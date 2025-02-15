const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./middleware/middleware');

const notesRouter = require('./controllers/notes');
const userRoutes = require('./controllers/users');
const loginRoutes = require('./controllers/login');

mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to Mongodb');
    })
    .catch((err) => {
        logger.info('error connecting to Mongodb ', err.message);
    });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

//routes
app.use('/api/notes', notesRouter);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;