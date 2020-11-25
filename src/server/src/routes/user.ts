import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '@entities/user';
import { errors } from '@shared/errors';
import logger from '@shared/Logger';
// import passportConfig from 'src/passportSetup';
import { findUserByEmail, registerUser } from '@modules/user';
const router = Router();
const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface Irole {
    role: 'student' | 'facultyMember';
}

interface sampleRequest extends Request {
    body: {
        user: IUser & Irole;
    };
}

router.post('/register', async (req: sampleRequest, res: Response) => {
    const { email, password, role, firstName, lastName } = req.body.user;
    if (!email || !password || !role || !firstName || !lastName) {
        return res
            .status(BAD_REQUEST)
            .json({ error: errors.paramMissingError })
            .end();
    }
    try {
        // TODO: Need to check student and faculty member entities actually
        const user = await findUserByEmail(email);
        if (user) {
            return res
                .status(BAD_REQUEST)
                .json({ error: 'Email is already taken' })
                .end();
        } else {
            // Creates an user account based on the role
            const user = await registerUser(
                email,
                password,
                firstName,
                lastName,
                role
            );
            // TODO: create jwt
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

export default router;
