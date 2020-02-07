import "@babel/polyfill";
import request from 'supertest';
import app from './app';

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
    })
    
})