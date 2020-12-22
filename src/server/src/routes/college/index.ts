import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { College } from '@entities/college';
import { errors } from '@shared/errors';
import { createCollege, getColleges, deleteCollege } from '@modules/college';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import { collegeSchema } from './schemas';

const router = Router();
const { CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface collegeRequest extends Request {
    body: {
        college: College;
    };
}

/******************************************************************************
 *              POST Request - Create - /api/college/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: collegeSchema }),
    async (req: collegeRequest, res: Response) => {
        const { name } = req.body.college;
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
 *              DELETE Request - Delete - /api/college/delete/:id
 ******************************************************************************/

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await deleteCollege(parseInt(id, 10));
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
