import express from 'express';
import cors from 'cors';
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Palette Picker';
app.use(cors());
app.use(express.json());

// All endpoints live here

app.get('/', (request, response) => {
  response.send('Let\'s create some palette color projects!');
});

export default app;