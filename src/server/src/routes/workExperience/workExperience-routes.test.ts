import faker from 'faker';
import request from 'supertest';
import app from '@app/.';
import { createStudentTestUser, signInTestStudentUser } from '@lib/testUtils';
import { connectToDb, disconnectFromDb } from '@db/connection';
import { WorkExperience } from '@entities/workExperience';

const mockWorkExperience = {
    message: faker.lorem.paragraph(),
    num: faker.random.number(),
};

let token: string;

beforeAll(async () => {
    // Creates connection with the database
    await connectToDb();
    await createStudentTestUser();

    // Login user
    token = await signInTestStudentUser();

    //NOTE: Error raised when trying to insert mock work experience into DB
    const workExperience = WorkExperience.create({});
    await workExperience.save(); 
});

afterAll(async () => {
    await disconnectFromDb();
});

describe('get', () => {
    const endpoint = '/api/workExperience/read';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).get(endpoint);
        expect(status).toBe(401);
    });

    it('should read work experience objects', async () => {
        const response = await request(app).get(endpoint).set('Cookie', token);
        const workExperiences = response.body.workExperiences;
        expect(response.status).toBe(200);
        expect(workExperiences).toBeInstanceOf(Array);
        expect(workExperiences.length).toBe(1);
        const workExperience = workExperiences[0];
        expect(workExperience.message).toBe(mockWorkExperience.message);
        expect(workExperience.num).toBe(mockWorkExperience.num);
    });
});

describe('create', () => {
    const endpoint = '/api/workExperience/create';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).post(endpoint);
        expect(status).toBe(401);
    });
    it('should fail since work experience object is not sent`', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({});
        expect(status).toBe(422);
    });
    it('should fail since empty work experience object is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {},
            });
        expect(status).toBe(422);
    });
    it('should fail since empty work experience message is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: '',
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience is not a string', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: 2413451251,
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience num is not sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: faker.random.words(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience num is not a number', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience num is a random object', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: faker.random.words(),
                    num: faker.random.objectElement(),
                },
            });
        expect(status).toBe(422);
    });
    it('should create a work experience record', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: 'hi',
                    num: 10,
                },
            });
        expect(status).toBe(201);
    });
});

describe('update', () => {
    const endpoint = '/api/workExperience/update';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).post(endpoint);
        expect(status).toBe(401);
    });
    it('should fail since work experience object is not sent`', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({});
        expect(status).toBe(422);
    });
    it('should fail since empty work experience object is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {},
            });
        expect(status).toBe(422);
    });
    it('should fail since empty work experience message is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: 1,
                    message: '',
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience message is not a string', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: 1,
                    message: 2413451251,
                    num: 30,
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience num is not sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: 1,
                    message: faker.random.words(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience num is not a number', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: 1,
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience id is not sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should fail since work experience id is not sent a number', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: faker.random.word(),
                    message: faker.random.words(),
                    num: faker.random.word(),
                },
            });
        expect(status).toBe(422);
    });
    it('should update an existing work experience record', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                workExperience: {
                    id: 1,
                    message: 'updated message',
                    num: 15,
                },
            });
        expect(status).toBe(200);
    });
});

describe('delete', () => {
    const endpoint = '/api/workExperience/delete';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).delete(`${endpoint}/1`);
        expect(status).toBe(401);
    });
    it('should pass even though work experience id does not belong to any work experience record', async () => {
        const { status } = await request(app)
            .delete(`${endpoint}/15`)
            .set('Cookie', token);
        expect(status).toBe(200);
    });
    it('should delete an existing work experience record', async () => {
        const { status } = await request(app)
            .delete(`${endpoint}/1`)
            .set('Cookie', token);
        expect(status).toBe(200);
    });
});