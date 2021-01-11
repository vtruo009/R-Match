import faker from 'faker';
import { connectToDb, disconnectFromDb, clearDb } from '../../connection';

import { Sample } from '@entities/sample';
import { createSample, getSamples, updateSample, deleteSample } from '.';

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

beforeAll(async () => {
    // Creates connection with the database
    await connectToDb();

    // Inserts mock samples to the database
    mockSamples.forEach(async (mockSample) => {
        await Sample.create({ ...mockSample });
    });
});

afterAll(async () => {
    await disconnectFromDb();
});

describe('sample', () => {
    describe('create', () => {
        it('should create a sample object', async () => {
            const mockSample = {
                message: faker.lorem.paragraph(),
                num: faker.random.number(),
            };
            const sample = await createSample(
                mockSample.message,
                mockSample.num
            );
            expect({ message: sample.message, num: sample.num }).toStrictEqual(
                mockSample
            );
        });
        // Add tests that cover other cases for create
    });
    // describe('get', () => {
    //     it('gets samples from the database', async () => {
    //         const samples = await getSamples();
    //         samples.forEach((sample, index) => {
    //             expect({
    //                 message: sample.message,
    //                 num: sample.num,
    //             }).toStrictEqual(mockSamples[index]);
    //         });
    //     });
    // });
});
