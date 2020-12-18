import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';

import { User, JWTUser } from '@entities/user';
import { FacultyMember } from '@entities/facultyMember';
import { Student } from '@entities/student';
import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import logger from '@shared/Logger';
import { cookieExtractor } from './jwt';

const filterSensitiveInformation = async (
    user: User
): Promise<JWTUser | undefined> => {
    const filteredUser = {
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
    };
    switch (user.role) {
        case 'student': {
            const student = await getRepository(Student).findOne({
                where: { user: { id: user.id } },
                select: ['id'],
            });
            if (!student) return undefined;

            return {
                ...filteredUser,
                specificUserId: student.id,
            };
        }

        case 'facultyMember': {
            const facultyMember = await getRepository(FacultyMember).findOne({
                where: { user: { id: user.id } },
                select: ['id'],
            });

            if (!facultyMember) return undefined;
            return {
                ...filteredUser,
                specificUserId: facultyMember.id,
            };
        }

        default:
            return undefined;
    }
};

// Used for authentication
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await getRepository(User).findOne({
                    email: username,
                });
                if (!user) return done(null, false);

                const isValid = await compare(password, user.password);
                if (!isValid) return done(null, false);

                const filteredUser = await filterSensitiveInformation(user);
                if (!filteredUser) return done(null, false);

                return done(null, filteredUser);
            } catch (error) {
                logger.err(error);
                return done(error, false);
            }
        }
    )
);

// Used for authorization
passport.use(
    'jwt',
    new JWTStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const user = await getRepository(User).findOne(jwtPayload.id);

                if (!user) return done(null, false);

                const filteredUser = await filterSensitiveInformation(user);

                if (!filteredUser) return done(null, false);

                return done(null, filteredUser);
            } catch (error) {
                logger.err(error);
                return done(null, false);
            }
        }
    )
);
