import request from 'supertest';
import { connectToDb, disconnectFromDb } from '@db/connection';
import app from '.';


// TODO: Connection to database fails whe container builds
beforeAll(async (done) => {
    await connectToDb();
    done();
});

afterAll(async (done) => {
    await disconnectFromDb();
    done();
});

describe('App', () => {
    it('should respond with 200', async () => {
        const { status } = await request(app).get('/');
        expect(status).toStrictEqual(200);
    });
    it('should respond with 404', async () => {
        const { status } = await request(app).patch('/bogus-route');
        expect(status).toStrictEqual(404);
    });
});
