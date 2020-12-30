import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { errors } from '@shared/errors';
import { getCourseByDepartmentId } from '@modules/course';
import logger from '@shared/Logger';

const router = Router();
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

/******************************************************************************
 *                  GET Request - Read - /api/course/read/:departmentId
 ******************************************************************************/

router.get(
    '/read/:departmentId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { departmentId } = req.params;
        try {
            const courses = await getCourseByDepartmentId(
                parseInt(departmentId, 10)
            );
            return res.status(OK).json({ courses }).end();
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
