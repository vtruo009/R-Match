import faker from 'faker';
import request from 'supertest';
import app from '@app/.';
import { createStudentTestUser, signInTestStudentUser, createFacultyMemberTestUser } from '@lib/testUtils';
import { connectToDb, disconnectFromDb } from '@db/connection';
import { Message } from '@entities/message';

const mockMessage1 = {
    content: faker.lorem.paragraph(),
    date: new Date(),
    senderId: 1,
    receiverId: 2
};

const mockMessage2 = {
    content: faker.lorem.paragraph(),
    date: new Date(),
    senderId: 1,
    receiverId: 2
};

const mockMessage3 = {
    content: faker.lorem.paragraph(),
    date: new Date(),
    senderId: 1,
    receiverId: 3
};

let token: string;

beforeAll(async () => {
    // Creates connection with the database
    await connectToDb();
    await createStudentTestUser();
    await createFacultyMemberTestUser();

    // Login user
    token = await signInTestStudentUser();

    // First mock message is sent earlier than the second one.
    mockMessage1.date.setMonth(2);
    mockMessage2.date.setMonth(3);

    // Inserts mock message to the database
    const message1 = Message.create({ ...mockMessage1 });
    await message1.save();
    const message2 = Message.create({ ...mockMessage2 });
    await message2.save();
    //const message3 = Message.create({ ...mockMessage3 });
    //await message3.save();
});

afterAll(async () => {
    await disconnectFromDb();
});

describe('sendMessage', () => {
    const endpoint = '/api/message/sendMessage';

    it('should fail since authorization token is not sent.', async () => {
        const { status } = await request(app).get(endpoint);
        expect(status).toBe(404);
    });

    it('should fail since the message object does not exist.`', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({});
        expect(status).toBe(422);
    });

    it('should fail since empty message object is sent', async () => {
        const { status } = await request(app)
            .post(endpoint)
            .set('Cookie', token)
            .send({
                sample: {},
            });
        expect(status).toBe(422);
    });

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

    it('should get all messages between two users.', async () => {
        const response = await request(app).get(`${endpoint}/2`).set('Cookie', token);
        const messages = response.body.messages;
        expect(response.status).toBe(200);

        expect(messages).toBeInstanceOf(Array);
        expect(messages.length).toBe(2); // Should not contain the third message.
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
});