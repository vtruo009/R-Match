import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStratefy } from 'passport-jwt';
import { User } from '@entities/user';
import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import logger from '@shared/Logger';

import { cookieExtractor } from './jwt';
// Used for authentication
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        (username, password, done) => {
            getRepository(User)
                .findOne({ email: username })
                .then((user) => {
                    // Check if user exists
                    if (!user) {
                        return done(null, false);
                    }
                    // Verify password
                    compare(password, user.password, (error, isValid) => {
                        if (error) {
                            done(error, false);
                        } else {
                            if (!isValid) {
                                done(null, false);
                            }
                            return done(null, user);
                        }
                    });
                })
                .catch((error) => {
                    logger.err(error);
                    done(error, false);
                });
        }
    )
);

// Used for authorization
passport.use(
    'jwt',
    new JWTStratefy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET,
        },
        (jwtPayload, done) => {
            getRepository(User)
                .findOne(jwtPayload.id)
                .then((user) => {
                    if (!user) {
                        done(null, false);
                    }
                    return done(null, user);
                })
                .catch((error) => {
                    logger.err(error);
                    done(error, false);
                });
        }
    )
);
