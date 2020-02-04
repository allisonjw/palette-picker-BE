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

app.get('/api/v1/users', async(request, response) => {
  try{ //when this endpoint hits, we're going to try
  const users = await database('users').select(); //pulling from our database and accessing the users table
  response.status(200).json(users);
  } catch (error) {
    response.status(500).json({error});
  }
})

export default app;