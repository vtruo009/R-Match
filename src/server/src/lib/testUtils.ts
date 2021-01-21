import request from 'supertest';

import app from '@app/.';
import { studentTestUser, facultyMemberTestUser } from '@db/data';
import { registerUser } from '@modules/user';

export const createStudentTestUser = async () => {
    await registerUser(
        studentTestUser.email,
        studentTestUser.password,
        studentTestUser.firstName,
        studentTestUser.lastName,
        'student'
    );
};

export const createFacultyMemberTestUser = async () => {
    await registerUser(
        facultyMemberTestUser.email,
        facultyMemberTestUser.password,
        facultyMemberTestUser.firstName,
        facultyMemberTestUser.lastName,
        'facultyMember'
    );
};

export const signInTestStudentUser = async (): Promise<string> => {
    const res = await request(app).post('/api/user/sign-in').send({
        email: studentTestUser.email,
        password: studentTestUser.password,
    });
    return res.headers['set-cookie'][0] as string;
};

export const signInFacultyMemberTestUser = async (): Promise<string> => {
    const res = await request(app).post('/api/user/sign-in').send({
        email: facultyMemberTestUser.email,
        password: facultyMemberTestUser.password,
    });
    return res.headers['set-cookie'][0] as string;
};
