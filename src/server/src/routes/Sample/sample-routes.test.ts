import faker from 'faker';
import request from 'supertest';
import app from '@app/.';
import { createStudentTestUser, signInTestStudentUser } from '@lib/testUtils';
import { connectToDb, disconnectFromDb } from '@db/connection';
import { Sample } from '@entities/sample';

const mockSample = {
    message: faker.lorem.paragraph(),
    num: faker.random.number(),
};

let token: string;

beforeAll(async (done) => {
    // Creates connection with the database
    await connectToDb();
    await createStudentTestUser();

    // Login user
    token = await signInTestStudentUser();

    // Inserts mock sample to the database
    const sample = Sample.create({ ...mockSample });
    await sample.save();
    done();
});

afterAll(async (done) => {
    await disconnectFromDb();
    done();
});

describe('get', () => {
    const endpoint = '/api/sample/read';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).get(endpoint);
        expect(status).toBe(401);
    });

    it('should read sample objects', async () => {
        const response = await request(app).get(endpoint).set('Cookie', token);
        const samples = response.body.samples;
        expect(response.status).toBe(200);
        expect(samples).toBeInstanceOf(Array);
        expect(samples.length).toBe(1);
        const sample = samples[0];
        expect(sample.message).toBe(mockSample.message);
        expect(sample.num).toBe(mockSample.num);
    });
});

describe('create', () => {
    const endpoint = '/api/sample/create';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).post(endpoint);
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
    it('should fail since sample num is a random object', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    message: faker.random.words(),
                    num: faker.random.objectElement(),
                },
            });
        expect(status).toBe(422);
    });
    it('should create a sample record', async () => {
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

describe('update', () => {
    const endpoint = '/api/sample/update';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).post(endpoint);
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
                    id: 1,
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
                    id: 1,
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
                    id: 1,
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
                    id: 1,
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since sample id is not sent', async () => {
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
    it('should fail since sample id is not sent a number', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    id: faker.random.word(),
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should update an existing sample record', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {
                    id: 1,
                    message: 'updated message',
                    num: 15,
                },
            });
        expect(status).toBe(200);
    });
});

describe('delete', () => {
    const endpoint = '/api/sample/delete';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).delete(`${endpoint}/1`);
        expect(status).toBe(401);
    });
    it('should pass even though sample id does not belong to any sample record', async () => {
        const { status } = await request(app)
            .delete(`${endpoint}/15`)
            .set('Cookie', token);
        expect(status).toBe(200);
    });
    it('should delete an existing sample record', async () => {
        const { status } = await request(app)
            .delete(`${endpoint}/1`)
            .set('Cookie', token);
        expect(status).toBe(200);
    });
});
