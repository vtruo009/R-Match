import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStratefy, ExtractJwt } from 'passport-jwt';
import { User } from '@entities/user';
import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';

// Used for authentication
passport.use(
    'jwt',
    new JWTStratefy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'afor1505',
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
                    done(error, false);
                });
        }
    )
);

// Used for authorization
passport.use(
    'signin',
    new LocalStrategy((email, password, done) => {
        getRepository(User)
            .findOne({ email })
            .then((user) => {
                // Check if user exists
                if (!user) {
                    console.log('User does not exist');
                    return done(null, false);
                }
                // Verify password
                compare(user.password, password, (error, isValid) => {
                    if (error) {
                        done(error);
                    } else {
                        if (!isValid) {
                            done(null, false);
                        }
                        return done(null, user);
                    }
                });
            })
            .catch((error) => {
                console.log('Something went wrong with db');
                console.log(error);
                done(error, false);
            });
    })
);
