import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Document } from '@entities/document';
import { errors } from '@shared/errors';
import {
    createDocument,
    getDocuments,
    deleteDocument,
} from '@modules/document';
import { JWTUser } from '@entities/user';
import logger from '@shared/Logger';
import passport from 'passport';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;

interface docRequest extends Request {
    body: {
        document: Document;
    };
}

/******************************************************************************
 *            POST Request - Create - /api/document/create
 ******************************************************************************/

 router.post(
     '/create',
     passport.authenticate('jwt', { session: false }),
     async (req: docRequest, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' })
                .end();
        }

        const {
            name,
            type,
            isDefault,
            document,
        } = req.body.document;
        try {
            let document1 = Buffer.alloc(16);
            const { result, message } = await createDocument(
                name,
                type,
                isDefault,
                document1, // TODO: replace document1 with document data received in the request
                specificUserId,
            );
            return result
                ? res.status(CREATED).end()
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
 *            POST Request - Read - /api/document/read
 ******************************************************************************/

router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }

        try {
            const documents = await getDocuments(specificUserId);
            return res.status(OK).json({ documents }).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
)

 /******************************************************************************
 *            DELETE Request - Delete - /api/document/delete/:id
 ******************************************************************************/

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { role } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' })
                .end();
        }
        const { id } = req.params;
        try {
            await deleteDocument(parseInt(id, 10));
            return res.status(OK).end();
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