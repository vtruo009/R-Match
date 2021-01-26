import faker from 'faker';
import request from 'supertest';
import app from '@app/.';
import { createStudentTestUser, signInTestStudentUser, createFacultyMemberTestUser } from '@lib/testUtils';
import { connectToDb, disconnectFromDb } from '@db/connection';
import { Student, classStandings } from '@entities/student';

const mockStudent1 = {
    departmentId: 1,
    sid: "100000",
    classStanding: "Senior",
    user: {
        userId: 1,
        email: "studentOne@gmail.com",
        firstName: faker.random.words(),
        lastName: faker.random.words()
    },
    courses: []
};

let token: string;

beforeAll(async () => {
    // Creates connection with the database
    await connectToDb();
    await createStudentTestUser();

    // Login user
    token = await signInTestStudentUser();
    jest.setTimeout(30000);
});

afterAll(async () => {
    await disconnectFromDb();
});

describe('search', () => {
    const endpoint = '/api/student/search';

    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).get(endpoint);
        expect(status).toBe(401);
    });
    
    it('should return all students when the request is empty.', async () => {
        const student1 = Student.create(mockStudent1);
        await student1.save();
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({});
        expect(status).toBe(422);
    });
    /*
    it('should fail since content is empty.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: "",
                receiverId: 1
            });
        expect(status).toBe(422);
    });

    it('should fail since receiverId is empty.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: faker.random.word(),
                receiverId: undefined
            });
        expect(status).toBe(422);
    });

    it('should fail since receiverId is not a number.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: faker.random.word(),
                receiverId: faker.random.word()
            });
        expect(status).toBe(422);
    });

    it('should fail since receiverId is same as the logged-in user id.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: faker.random.word(),
                receiverId: 1
            });
        expect(status).toBe(400);
    });

    it('should fail since receiverId does not exist.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: faker.random.word(),
                receiverId: 10
            });
        expect(status).toBe(400);
    });

    it('should create new message.', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                content: faker.random.word(),
                receiverId: 2
            });
        expect(status).toBe(201);
    });
});

describe('getMessages', () => {
    const endpoint = '/api/message/getMessages';
    it('should fail since authorization token is not sent', async () => {
        const { status } = await request(app).get(`${endpoint}/1`);
        expect(status).toBe(401);
    });

    it('should fail since the required parameter is missing.', async () => {
        const response = await request(app).get(endpoint).set('Cookie', token);
        expect(response.status).toBe(404);
    });

    it('should get all messages between two users.', async () => {
        const response = await request(app).get(`${endpoint}/2`).set('Cookie', token);
        const messages = response.body.messages;
        expect(response.status).toBe(200);

        expect(messages).toBeInstanceOf(Array);
        expect(messages.length).toBe(2);
        const messageAtIndex0 = messages[0];
        const messageAtIndex1 = messages[1];

        expect(messageAtIndex0.content).toBe(mockMessage1.content);
        expect(messageAtIndex0.senderId).toBe(mockMessage1.senderId);
        expect(messageAtIndex0.receiverId).toBe(mockMessage1.receiverId);
        expect(messageAtIndex0.date).toBe(mockMessage1.date.toISOString());

        expect(messageAtIndex1.content).toBe(mockMessage2.content);
        expect(messageAtIndex1.senderId).toBe(mockMessage2.senderId);
        expect(messageAtIndex1.receiverId).toBe(mockMessage2.receiverId);
        expect(messageAtIndex1.date).toBe(mockMessage2.date.toISOString());
    });
    */
});