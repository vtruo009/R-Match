import faker from 'faker';
import request from 'supertest';
import app from '@app/.';
import { createStudentTestUser, signInTestStudentUser } from '@lib/testUtils';
import { connectToDb, disconnectFromDb, clearDb } from '@db/connection';
import { Sample } from '@entities/sample';

const mockSamples = [
    {
        message: faker.lorem.paragraph(),
        num: faker.random.number(),
    },
    {
        message: faker.lorem.paragraph(),
        num: faker.random.number(),
    },
    {
        message: faker.lorem.paragraph(),
        num: faker.random.number(),
    },
];

let token: string;
beforeAll(async () => {
    // Creates connection with the database
    await connectToDb();
    await createStudentTestUser();

    // Login user
    token = await signInTestStudentUser();

    // Inserts mock samples to the database
    mockSamples.forEach(async (mockSample) => {
        const samples = Sample.create({ ...mockSample });
        await samples.save();
    });
});

afterAll(async () => {
    await clearDb();
    await disconnectFromDb();
});

describe('create', () => {
    const endpoint = '/api/sample/create';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .send({
                sample: {
                    message: 'hi',
                    num: 10,
                },
            });
        expect(status).toBe(401);
    });
    it('should fail since sample object is not sent`', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({});
        expect(status).toBe(422);
    });
    it('should fail since empty sample object is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {},
            });
        expect(status).toBe(422);
    });
    it('should fail since empty sample message is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: '',
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since sample message is not a string', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: 2413451251,
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since sample num is not sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: faker.random.words(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since sample num is not a number', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should create a sample object', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: 'hi',
                    num: 10,
                },
            });
        expect(status).toBe(201);
    });
});

// TODO: Figure out how to test updates and deletes
// describe('update', () => {
//     const endpoint = 'api/sample/update';
// });

// describe('delete', () => {
//     const endpoint = 'api/sample/delete';
// });

describe('get', () => {
    const endpoint = '/api/sample/read';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).get(endpoint);
        expect(status).toBe(401);
    });

    it('should read sample objects', async () => {
        const response = await request(app).get(endpoint).set('Cookie', token);
        expect(response.status).toBe(200);
        expect(response.body.samples.length).toBe(4);
    });
});
