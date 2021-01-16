import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { Sample } from '@entities/sample';
import { errors } from '@shared/errors';
import passport from 'passport';
import {
    getSamples,
    createSample,
    updateSample,
    deleteSample,
} from '@modules/sample';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import { sampleCreatSchema, sampleUpdateSchema } from './schemas';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface sampleRequest extends Request {
    body: {
        sample: Sample;
    };
}

/******************************************************************************
 *            POST Request - Create - /api/sample/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: sampleCreatSchema }),
    async (req: sampleRequest, res: Response) => {
        const { message, num } = req.body.sample;
        try {
            await createSample(message, num);
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

/******************************************************************************
 *                GET Request - Read - /api/sample/read
 ******************************************************************************/

router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const samples = await getSamples();
            return res
                .status(OK)
                .json({
                    samples,
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
 *             POST Request - Update - /api/sample/update
 ******************************************************************************/

router.post(
    '/update',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: sampleUpdateSchema }),
    async (req: sampleRequest, res: Response) => {
        const { message, num, id } = req.body.sample;
        try {
            await updateSample(message, num, id);
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

/******************************************************************************
 *              DELETE Request - Delete - /api/sample/delete/:id
 ******************************************************************************/

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await deleteSample(parseInt(id, 10));
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

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
