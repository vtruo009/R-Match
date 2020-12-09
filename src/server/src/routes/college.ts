import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { ICollege } from '@entities/college';
import { errors } from '@shared/errors';
import { createCollege } from '@modules/college';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface collegeRequest extends Request {
    body: {
        college: ICollege;
    };
}

/******************************************************************************
 *           POST Request - Create - /api/college/create
 ******************************************************************************/

router.post('/create', async (req: collegeRequest, res: Response) => {
    const { college } = req.body;

    if (!college) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    const { name } = college;

    // Check if required field is missing.
    if (!name) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    try {
        await createCollege(name);
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
 *                                     Export
 ******************************************************************************/

export default router;
