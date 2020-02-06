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
    })
    
})