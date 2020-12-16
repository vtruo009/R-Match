import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { ICollege } from '@entities/college';
import { errors } from '@shared/errors';
import { createCollege, getColleges } from '@modules/college';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface collegeRequest extends Request {
    body: {
        college: ICollege;
    };
}

/******************************************************************************
 *              POST Request - Create - /api/college/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    async (req: collegeRequest, res: Response) => {
        const { college } = req.body;

        if (!college) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

        const { name } = college;

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
    }
);

/******************************************************************************
 *                  GET Request - Read - /api/college/read
 ******************************************************************************/

router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const colleges = await getColleges();
            return res.status(OK).json({ colleges }).end();
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
