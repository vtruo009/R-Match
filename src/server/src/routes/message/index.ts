import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { validationMiddleware } from '@middlewares/validation';
import {
    sendMessageSchema,
    getMessagesSchema,
} from './schemas';
import passport from 'passport';
import logger from '@shared/Logger';
import { errors } from '@shared/errors';
import { JWTUser } from '@entities/user';
import {
    getMessages,
    sendMessage,
    getConversationList,
    getUserByEmail,
} from '@modules/message';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
} = StatusCodes;

interface sendMessageRequest extends Request {
    body: {
        content: string;
        receiverId: number;
    };
}

/******************************************************************************
 *        POST Request - Send Message - /api/message/sendMessage
 ******************************************************************************/

router.post('/sendMessage',
    validationMiddleware({ bodySchema: sendMessageSchema }),
    passport.authenticate('jwt', { session: false }),
    async (req: sendMessageRequest, res: Response) => {
        const { userId } = req.user as JWTUser;
        const { receiverId, content } = req.body;
        try {
            const { result, errorMessage } =
                await sendMessage(content, receiverId, /*senderId=*/userId);
            return result
                ? res.status(CREATED).end()
                : res.status(BAD_REQUEST).json({ error: errorMessage }).end();
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
 *       GET Request - Get Messages - /api/message/getMessages
 ******************************************************************************/

interface GetMessagesRequest extends Request {
    query: {
        messangerId: string;
        page: string;
    };
}

router.get('/getMessages',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: getMessagesSchema }),
    async (req: GetMessagesRequest, res: Response) => {
        const { userId } = req.user as JWTUser;
        try {
            const { messangerId, page } = req.query;
            const { result, errorMessage } = await getMessages(
                userId,
                parseInt(messangerId, 10),
                parseInt(page, 10)
            );

            if (!result) return res.status(BAD_REQUEST).json({ error: errorMessage }).end();

            const [ messages, messagesCount ] = result;
            return res.status(OK).json({ messages, messagesCount }).end();
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
 *  GET Request - Get conversation list - /api/message/getConversationList
 ******************************************************************************/

router.get('/getConversationList',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { userId } = req.user as JWTUser;
        try {
            const { result, errorMessage } = await getConversationList(userId);
            return result
                ? res.status(OK).json({ conversationList: result }).end()
                : res.status(BAD_REQUEST).json({ error: errorMessage }).end();
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
 *       GET Request - Get user By Email - /api/message/get-user-by-email/:email
 ******************************************************************************/

router.get(
    '/get-user-by-email/:email',
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

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;