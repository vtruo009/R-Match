import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import passport from 'passport';

import { JWTUser } from '@entities/user';
import { errors } from '@shared/errors';
import logger from '@shared/Logger';
import { findUserByEmail, registerUser, getUserByEmail } from '@modules/user';
import { User } from '@entities/user';
import { signToken } from '@lib/jwt';
import { validationMiddleware } from '@middlewares/validation';
import { signUpSchema, signInSchema } from './schemas';
import { clientPath } from '@app/index';

const router = Router();
const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;
interface ISignUpRequest extends Request {
    body: {
        user: User;
    };
}

/******************************************************************************
 *              POST Request - Sign up - /api/user/sign-up
 ******************************************************************************/

router.post(
    '/sign-up',
    validationMiddleware({ bodySchema: signUpSchema }),
    async (req: ISignUpRequest, res: Response) => {
        const { email, password, role, firstName, lastName } = req.body.user;
        try {
            const user = await findUserByEmail(email);
            if (user) {
                return res
                    .status(BAD_REQUEST)
                    .json({ error: 'Email is already taken' })
                    .end();
            } else {
                await registerUser(email, password, firstName, lastName, role);
                return res.send(CREATED).end();
            }
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

/******************************************************************************
 *              POST Request - Sign in- /api/user/sign-in
 ******************************************************************************/

router.post(
    '/sign-in',
    validationMiddleware({ bodySchema: signInSchema }),
    passport.authenticate('local', { session: false }),
    (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const {
                userId,
                role,
                firstName,
                lastName,
                specificUserId,
            } = req.user as JWTUser;
            const token = signToken(userId);
            res.cookie('access_token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                // domain: clientPath,
            });
            return res
                .status(OK)
                .json({
                    isAuthenticated: true,
                    user: { userId, specificUserId, role, firstName, lastName },
                })
                .end();
        }
    }
);

/******************************************************************************
 *              GET Request - Sign out - /api/user/sign-out
 ******************************************************************************/

router.get(
    '/sign-out',
    passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response) => {
        res.clearCookie('access_token');
        return res.status(OK).json({
            user: {
                userId: '',
                specificUserId: '',
                role: '',
                firstName: '',
                lastName: '',
            },
            success: true,
        });
    }
);

/******************************************************************************
 *              GET Request - Authenticated - /api/user/authenticated
 ******************************************************************************/

router.get(
    '/authenticated',
    passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response) => {
        const {
            userId,
            specificUserId,
            role,
            firstName,
            lastName,
        } = req.user as JWTUser;

        return res.status(OK).json({
            user: { userId, specificUserId, role, firstName, lastName },
            isAuthenticated: true,
        });
    }
);

/******************************************************************************
 *       GET Request - Get By Email - /api/user/get-by-email/:email
 ******************************************************************************/

router.get(
    '/get-by-email/:email',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { userId } = req.user as JWTUser;
        const { email } = req.params;
        try {
            const { result, message } = await getUserByEmail(userId, email);
            return result
                ? res.status(OK).json({ user: result }).end()
                : res.status(BAD_REQUEST).json({ error: message }).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

export default router;
