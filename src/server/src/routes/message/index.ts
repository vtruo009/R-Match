import StatusCodes from 'http-status-codes';
import express, { Request, Response, Router } from 'express';
import { validationMiddleware } from '@middlewares/validation';
import { messageSendSchema } from './schemas';
import { Message } from '@entities/message';
import passport from 'passport';
import logger from '@shared/Logger';
import { errors } from '@shared/errors';
import {
    getMessages,
    createMessage
} from '@modules/message';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;

interface messageRequest extends Request {
    body: {
        message: Message;
    };
}


router.post('/sendMessage',
    validationMiddleware({ bodySchema: messageSendSchema }),
    passport.authenticate('jwt', { session: false }),
    async (req: messageRequest, res: Response) => {
        const { message } = req.body.message;
        try {
            await createMessage(message);
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


router.get('/getMessages',
    passport.authenticate('jwt', { session: false }),
    async (req: messageRequest, res: Response) => {
        try {
            const messages = await getMessages();
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

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
