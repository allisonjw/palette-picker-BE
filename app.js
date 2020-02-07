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

app.get('/api/v1/palettes', async(request, response) => {
  try { //when this endpoint hits we're going to try
  const palettes = await database('palettes').select();//pulling from out database and accessing the palettes table
  response.status(200).json(palettes)
  } catch (error ) {
    response.status(500).json({error})
  }
})

app.get('/api/v1/palettes/:id', async(request, response) => {
  const { id } = request.params;
  try {
    const palette = await database('palettes').where('id', id)
    if(palette.length) {
      response.status(200).json(palette)
    } else {
      response.status(404).json({error: 'palette not found'})
    }
  } catch (error) {
    response.status(500).json({error})
  }
});

app.get('/api/v1/projects', async(request, response) => {
  try { //when this endpoint hits we're going to try
  const projects = await database('projects').select();//pulling from out database and accessing the projects table
  response.status(200).json(projects)
  } catch (error ) {
    response.status(500).json({error})
  }
});

app.get('/api/v1/projects/:id', async(request, response) => {
  const { id } = request.params;
  try {
    const project = await database('projects').where('id', id)
    if(project.length) {
      response.status(200).json(project)
    } else {
      response.status(404).json({error: 'project not found'})
    }
  } catch (error) {
    response.status(500).json({error})
  }
});



export default app;