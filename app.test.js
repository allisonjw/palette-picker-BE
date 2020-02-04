import "@babel/polyfill";
import request from 'supertest';
import app from './app';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

desribe('Server', () => {
    beforeEach(async() => {
        await database.seed.run() //reruns the seed 
    })
    describe('init', () => {
        it('should return a 200 status', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        });
    });
    describe('GET /api/v1/', () => {
        it('should return a status code of 200 and all the colors', async () => {
            //SET UP
            //EXECUTION
            //ASSERTION
        })
    })
})