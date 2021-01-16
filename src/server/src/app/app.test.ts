import request from 'supertest';
import { connectToDb } from '@db/connection';
import app from '.';


beforeAll(async () => {
    await connectToDb();
});

describe('App', function () {
    it('should respond with 200', async () => {
        const { status } = await request(app).get('/');
        expect(status).toStrictEqual(200);
    });
    it('should respond with 404', async () => {
        const { status } = await request(app).patch('/bogus-route');
        expect(status).toStrictEqual(404);
    });
});