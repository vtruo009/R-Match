import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import passport from 'passport';
import { IUser } from '@entities/user';
import { errors } from '@shared/errors';
import logger from '@shared/Logger';

import { findUserByEmail, registerUser } from '@modules/user';
import { signToken } from '@lib/jwt';

const router = Router();
const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;
interface ISignUpRequest extends Request {
    body: {
        user: IUser & { confirmedPassword: string };
    };
}

/******************************************************************************
 *              POST Request - Sign up - /api/user/sign-up
 ******************************************************************************/

router.post('/sign-up', async (req: ISignUpRequest, res: Response) => {
    const { user } = req.body;
    const {
        email,
        password,
        confirmedPassword,
        role,
        firstName,
        lastName,
    } = user;

    if (!user) {
        return res
            .status(BAD_REQUEST)
            .json({ error: errors.paramMissingError })
            .end();
    }
    if (
        !email ||
        !password ||
        !confirmedPassword ||
        !role ||
        !firstName ||
        !lastName
    ) {
        return res
            .status(BAD_REQUEST)
            .json({ error: errors.paramMissingError })
            .end();
    }
    if (password !== confirmedPassword) {
        return res
            .status(BAD_REQUEST)
            .json({ error: 'Passwords do not match' });
    }
    if (role !== 'student' && role !== 'facultyMember') {
        return res.status(BAD_REQUEST).json({ error: 'Invalid role' }).end();
    }

    try {
        const user = await findUserByEmail(email);
        if (user) {
            return res
                .status(BAD_REQUEST)
                .json({ error: 'Email is already taken' })
                .end();
        } else {
            // Creates an user account based on the role
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
});

/******************************************************************************
 *              POST Request - Sign in- /api/user/sign-in
 ******************************************************************************/

router.post(
    '/sign-in',
    passport.authenticate('local', { session: false }),
    (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const { id, role, firstName, lastName } = req.user as IUser;
            // TODO: Filter user sensitive information
            const token = signToken(id);
            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: true,
            });
            return res
                .status(OK)
                .json({
                    isAuthenticated: true,
                    user: { id, role, firstName, lastName },
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
            user: { id: '', role: '', firstName: '', lastName: '' },
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
        const { id, role, firstName, lastName } = req.user as IUser;
        return res.status(OK).json({
            user: { id, role, firstName, lastName },
            isAuthenticated: true,
        });
    }
);

export default router;
