const express = require('express');
const cors = require('cors');
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

app.post('/api/v1/palettes', async (request, response) => {
  //pull actual payload that got sent from body of request
  const palette = request.body;
  //checking the object to see if it has all the required parameters

  for(let requiredParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if(!palette.hasOwnProperty(requiredParameter)) { 
      return response
        .status(422)
        .send({error: `The expected format is: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>}. You're missing a ${requiredParameter} property.`})
    }
  }
  try {
    const id = await database('palettes').insert(palette, 'id');//inserting a palette, and getting back the id
    response.status(201).json({id});
  } catch (error) {
    response.status(500).json({error});
  }
});

app.post('/api/v1/palettes', async (request, response) => {
  const newPalette = request.body;
  for(let requiredParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if(!newPalette[requiredParameter]) {
      return response
        .status(422)
        .send({error: `The expected format is: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>. Your\'re missing a ${requiredParameter} property.`})
    }
  }
  const newlyAddedPalette = await database('palettes').insert(newPalette, 'id');

  if(newlyAddedPalette) {
    return response.status(201).json({ id: newslyAddedPalette[0]})
  } else {
    return response.status(422).json({error: 'Could not create palette!'})
  }
});

app.patch('/api/v1/palettes/:id', async (request, response) => {
  const revisedPalette = request.body;
  const { id } = request.params;
  try {
    const paletteId = await database('palettes').where('id', id).update(revisedPalette, 'id');

    if (!paletteId) {
      return response.status(404)
    } else {
      return response.status(204).json(paletteId)
    }
  } catch (error) {
    response.status(500).json({error})
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const selectedPalette = await database('palettes').where('id', request.params.id).select();

  if (selectedPalette.length) {
    await database('palettes').where('id', request.params.id).del();

    response.status(200).json(`Palette number ${request.params.id} has been removed`)
  } else {
    return response.status(400).json({error: `Palette number ${request.params.id} could not be found.`})
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

app.post('/api/v1/projects', async (request, response) => {
  //pull actual payload that got sent from body of request
  const project = request.body;
  //checking the object to see if it has all the required parameters

  for(let requiredParameter of ['project_name']) {
    if(!project.hasOwnProperty(requiredParameter)) { 
      return response
        .status(422)
        .send({error: `The expected format is: { project_name: <String>} You're missing a ${requiredParameter} property.`})
    }
  }
  try {
    const id = await database('projects').insert(project, 'id');//inserting a project, and getting back the id
    response.status(201).json({id});
  } catch (error) {
    response.status(500).json({error});
  }
});

// app.post('/api/v1/projects', async (request, response) => {
//   const newProject = request.body;
//   for(let requiredParameter of ['project_name']) {
//     if(!newProject[requiredParameter]) {
//       return response
//         .status(422)
//         .send({error: `The expected format is: { project_name: <String>. Your\'re missing a ${requiredParameter} property.`})
//     }
//   }
//   const newlyAddedProject = await database('projects').insert(newProject, 'id');

//   if(newlyAddedProject) {
//     return response.status(201).json({ id: newlyAddedProject[0]})
//   } else {
//     return response.status(422).json({error: 'Could not create project!'})
//   }
// });

app.patch('/api/v1/projects/:id', async (request, response) => {
  const revisedProject = request.body;
  const { id } = request.params;
  try {
    const projectId = await database('projects').where('id', id).update(revisedProject, 'id');

    if (!projectId) {
      return response.status(404)
    } else {
      return response.status(204).json(projectId)
    }
  } catch (error) {
    response.status(500).json({error})
  }

})


app.delete('/api/v1/projects/:id', async (request, response) => {
  const selectedProject = await database('projects').where('id', request.params.id).select();

  if (selectedProject.length) {
    await database('projects').where('id', request.params.id).del();

    response.status(200).json(`Project number ${request.params.id} has been removed`)
  } else {
    return response.status(400).json({error: `Project number ${request.params.id} could not be found.`})
  }
})


module.exports = app;