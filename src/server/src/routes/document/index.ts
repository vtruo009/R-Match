import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Document } from '@entities/document';
import { errors } from '@shared/errors';
import {
    createDocument,
    getDocuments,
    getDocumentData,
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
        document: {
            name: Document['name'];
            type: Document['type'];
            isDefault: Document['isDefault'];
            data: string;
        };
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
        const { name, type, isDefault, data } = req.body.document;
        try {
            const { result, message } = await createDocument(
                name,
                type,
                isDefault,
                data,
                specificUserId
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
        const { specificUserId } = req.user as JWTUser;
        try {
            const documents = await getDocuments(specificUserId);
            if (!documents)
                return res
                    .status(BAD_REQUEST)
                    .json({ error: 'Student does not exist' })
                    .end();
            return res.status(OK).json({ documents }).end();
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

router.get(
    '/get-data/:documentId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { documentId } = req.params;
        try {
            // const documents = await getDocuments(specificUserId, type.toString());
            const documentData = await getDocumentData(
                parseInt(documentId, 10)
            );
            if (!documentData)
                return res
                    .status(BAD_REQUEST)
                    .json({ error: 'Document does not exist' })
                    .end();
            return res.status(OK).json({ documentData }).end();
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
