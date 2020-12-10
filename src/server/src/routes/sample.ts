import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { ISample } from '@entities/sample';
import { errors } from '@shared/errors';
import {
    getSamples,
    createSample,
    updateSample,
    deleteSample,
} from '@modules/sample';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface sampleRequest extends Request {
    body: {
        sample: ISample;
    };
}

/******************************************************************************
 *            POST Request - Create - /api/sample/create
 ******************************************************************************/

router.post('/create', async (req: sampleRequest, res: Response) => {
    const { sample } = req.body;
    const { message, num } = sample;
    if (!sample) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
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
});

/******************************************************************************
 *                GET Request - Read - /api/sample/read
 ******************************************************************************/

router.get('/read', async (req: Request, res: Response) => {
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
});

/******************************************************************************
 *             POST Request - Update - /api/sample/update
 ******************************************************************************/

router.post('/update', async (req: sampleRequest, res: Response) => {
    const { sample } = req.body;
    const { message, num, id } = sample;
    if (!sample) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
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
});

/******************************************************************************
 *              DELETE Request - Delete - /api/users/delete/:id
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
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
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
