const palettes = require('../../../data/palettesData');
const users = require('../../../data/usersData');
const projects = require('../../../data/projectsData');

const createUser = (knex, user) => {
  return knex('users')
    .insert(
      {
        username: user.name,
        password: user.password
      },
      'id'
    )
    .then(user_id => {
      let projectPromises = [];
      projects
      .filter(project => project.user_id === user.id)
      .forEach(project => {
          projectPromises.push(
            createProject(knex, {
              project_id: project.project_id,
              project_name: project.project_name,
              user_id: user_id[0]
            })
          );
        });
      return Promise.all(projectPromises)
    });
};

const createProject = (knex, project) =>
  knex('projects')
    .insert({               
      project_name: project.project_name,
      user_id: project.user_id
    }, 'id')
    .then(project_id => {
      let palettePromises = [];
      palettes
        .filter(palette => palette.project_id === project.project_id)
        .forEach(palette => {
          palettePromises.push(
            createPalette(knex, {
              palette_name: palette.palette_name,
              project_id: project_id[0],
              color_1: palette.color_1,
              color_2: palette.color_2,
              color_3: palette.color_3,
              color_4: palette.color_4,
              color_5: palette.color_5
            })
          );
        });
        
        return Promise.all(palettePromises)
    });

const createPalette = (knex, palette) => knex('palettes').insert(palette);

exports.seed = function(knex) {
  return knex('palettes')
    .del()
    .then(() => knex('projects').del())
    .then(() => knex('users').del())
    .then(() => {
      let userPromises = [];
      users.forEach(user => {
        userPromises.push(createUser(knex, user));
      });
      return Promise.all(userPromises);
    })
    .catch(error => console.log(`Error seeding data ${error}`));
};

