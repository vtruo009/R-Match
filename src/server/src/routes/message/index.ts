import StatusCodes from 'http-status-codes';
import express, { Request, Response, Router } from 'express';
import { validationMiddleware } from '@middlewares/validation';
import { sendMessageSchema } from './schemas';
import { Message } from '@entities/message';
import passport from 'passport';
import logger from '@shared/Logger';
import { errors } from '@shared/errors';
import { JWTUser } from '@entities/user';
import {
    getMessages,
    sendMessage,
    getCommunicatedUsers
} from '@modules/message';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;

interface sendMessageRequest extends Request {
    body: {
        message: string;
        receiverId: number;
    };
}

interface getMessageRequest extends Request {
    body: {
        communicatorId: number;
    };
}

router.post('/sendMessage',
    validationMiddleware({ bodySchema: sendMessageSchema }),
    passport.authenticate('jwt', { session: false }),
    async (req: sendMessageRequest, res: Response) => {
        const { userId } = req.user as JWTUser;
        const { receiverId, message } = req.body;
        try {
            console.log("Sender ID2: " + userId);
            await sendMessage(message, receiverId, userId);
            return res.status(CREATED).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

router.get('/getMessages/:peerId',
    passport.authenticate('jwt', { session: false }),
    async (req: getMessageRequest, res: Response) => {
        const { userId } = req.user as JWTUser;
        const { peerId } = req.params;
        try {
            const messages = await getMessages(userId, parseInt(peerId, 10));
            return res
                .status(OK)
                .json({
                    messages,
                })
                .end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

router.get('/getPastMessageSenders',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        //checks that caller is a student.
        const { userId } = req.user as JWTUser;
        try {
            const users = await getCommunicatedUsers(userId);
            return res
                .status(OK)
                .json({
                    users,
                })
                .end();
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
 *                                     Export
 ******************************************************************************/

export default router;
