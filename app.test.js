require("@babel/polyfill");;
const request = require('supertest');
const app = require('./app');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
    beforeEach(async() => {
        await database.seed.run() //reruns the seed 
    })
    describe('init', () => {
        it('should return a 200 status', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        });
    });
    describe('Palettes', () => {
        describe('GET /api/v1/palettes', () => {
            it('should return a status code of 200 and all the palettes', async () => {
                //SET UP
                //dealing with database itself
                const expectedPalettes = await database('palettes').select();
                //now super test comes into play
                //EXECUTION
                const response = await request(app).get('/api/v1/palettes');
                const palettes = response.body //to see if we get the response we want back
                //ASSERTION
                expect(response.status).toBe(200); //HAPPY PATH
                expect(palettes).toEqual(expectedPalettes);
                //now implement the route in the server file aka app.js
            })
        });
        describe('GET /api/v1/palettes/:id', () => {
            it('should return a code of 200 and a single palette if the palette exists', async () => {
                const expectedPalette = await database('palettes').first();
                const { id } = expectedPalette;
                const response = await request(app).get(`/api/v1/palettes/${id}`);
                const result = response.body[0];
                expect(response.status).toBe(200);
                expect(result).toEqual(expectedPalette);
            });
            it('should return a 404 and "palette not found" if the resource is not there', async () => {
                const invalidId = -1;
    
                const response = await request(app).get(`/api/v1/palettes/${invalidId}`)
                expect(response.status).toBe(404);
                expect(response.body.error).toEqual('palette not found');
            })
        })
        describe('POST /api/v1/palettes', () => { //similar api to get request, patch, or post. //HAPPY PATH
            it('should post a new palette to the database', async() => {
              //setup
              //mocking out a palette
              const newPalette = { palette_name: 'Sailing Away', color_1: '#17E2B4', color_2: '#143472', color_3: '#060E1E', color_4: '#A3AFC6', color_5: '#E52522' };
              //execution
              //utilize super test
              //store the response in variable
              const response = await request(app).post('/api/v1/palettes').send(newPalette) //going to send that new palette over
              //pull from the database
              const palettes = await database('palettes').where('id', response.body.id[0]) //i'm going to check the database to see if the palette is in there
      
              const palette = palettes[0] //pull that value out and give back palette
              //check the response that we get back
              //assertion
              expect(response.status).toBe(201);
              expect(palette.palette_name).toEqual(newPalette.palette_name) //checking the resource check a different key
      
              //now implement the route
            });
            it('should return a status code of 422 when a required parameter is missing', async () => { //SAD PATH
                const newPalette = {} //creating our new palette object
                const response = await request(app).post('/api/v1/palettes').send(newPalette);

                expect(response.status).toBe(422);
                expect(response.body.error).toEqual('The expected format is: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>}. You\'re missing a palette_name property.')

                //now implement the server
            })
        });
        describe('PATCH /api/v1/palettes/:id', () => { //HAPPY PATH
            it('should return a status code of 204 and should update a palette', async () => {
                //we would have to mock out the data that you want to edit
                const updatedPaletteInfo = {
                    palette_name: 'Japanese Sunrise',
                    color_1: '#17E2B4',
                    color_2: '#17E2B4',
                    color_3: '#17E2B4',
                    color_4: '#17E2B4',
                    color_5: '#E52522'
                }
                const selectedPalette = await database('palettes').first();
                const mockId = selectedPalette.id;

                const response = await request(app).patch(`/api/v1/palettes/${mockId}`).send(updatedPaletteInfo);
                const expectedPalette = await database('palettes').where('id', mockId)

                expect(response.status).toBe(204);
                expect(expectedPalette[0].palette_name).toEqual(updatedPaletteInfo.palette_name)
            })
        });
        describe('DELETE /api/v1/palettes/:id', () => {
            it('should return a status code of 200 and delete a palette', async () => {
                const selectedPalette = await database('palettes').first();
                const mockId = selectedPalette.id;

                const response = await request(app).delete(`/api/v1/palettes/${mockId}`);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(`Palette number ${mockId} has been removed`)
            })
        });
    });
    describe('Projects', () => {
        describe('GET /api/v1/projects', () => {
            it('should return a status code of 200 and all the projects', async () => {
                //SET UP
                //dealing with database itself
                const expectedProjects = await database('projects').select();
                //now super test comes into play
                //EXECUTION
                const response = await request(app).get('/api/v1/projects');
                const projects = response.body //to see if we get the response we want back
                //ASSERTION
                expect(response.status).toBe(200); //HAPPY PATH
                expect(projects).toEqual(expectedProjects);
                //now implement the route in the server file aka app.js
            })
        });
        describe('GET /api/v1/projects/:id', () => {
            it('should return a code of 200 and a single project if the project exists', async () => {
                const expectedProject = await database('projects').first();
                const { id } = expectedProject;
                const response = await request(app).get(`/api/v1/projects/${id}`);
                const result = response.body[0];
                expect(response.status).toBe(200);
                expect(result).toEqual(expectedProject);
            });
            it('should return a 404 and "project not found" if the resource is not there', async () => {
                const invalidId = -1;
    
                const response = await request(app).get(`/api/v1/projects/${invalidId}`)
                expect(response.status).toBe(404);
                expect(response.body.error).toEqual('project not found');
            })
        })
        describe('POST /api/v1/projects', () => { //similar api to get request, patch, or post
            it('should post a new project to the database', async() => {
              //setup
              //mocking out a project
              const newProject = { project_name: 'Allison\'s House'};
              //execution
              //utilize super test
              //store the response in variable
              const response = await request(app).post('/api/v1/projects').send(newProject) //going to send that new project over
              //pull from the database
              const projects = await database('projects').where('id', response.body.id[0]) //i'm going to check the database to see if the project is in there
      
              const project = projects[0] //pull that value out and give back project
              //check the response that we get back
              //assertion
              expect(response.status).toBe(201);
              expect(project.project).toEqual(newProject.project) //checking the resource check a different key
      
              //now implement the route
            })
        });
        describe('PATCH /api/v1/projects/:id', () => { //HAPPY PATH
            it('should return a status code of 204 and should update a project', async () => {
                //we would have to mock out the data that you want to edit
                const updatedProjectInfo = {
                    project_name: 'Japanese House'
                }
                const selectedProject = await database('projects').first();
                const mockId = selectedProject.id;

                const response = await request(app).patch(`/api/v1/projects/${mockId}`).send(updatedProjectInfo);
                const expectedProject = await database('projects').where('id', mockId)

                expect(response.status).toBe(204);
                expect(expectedProject[0].project_name).toEqual(updatedProjectInfo.project_name)
            })
        });
        describe('DELETE /api/v1/projects/:id', () => {
            it('should return a status code of 200 and delete a project', async () => {
                const selectedProject = await database('projects').first();
                const mockId = selectedProject.id;

                const response = await request(app).delete(`/api/v1/projects/${mockId}`);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(`Project number ${mockId} has been removed`)
            })
        });

    })
    
})