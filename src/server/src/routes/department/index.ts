import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { Department } from '@entities/department';
import { errors } from '@shared/errors';
import {
    createDepartment,
    deleteDepartment,
    getDepartments,
} from '@modules/department';
import { validationMiddleware } from '@middlewares/validation';
import passport from 'passport';
import logger from '@shared/Logger';
import { departmentSchema } from './schemas';

const router = Router();
const { CREATED, INTERNAL_SERVER_ERROR, OK, BAD_REQUEST } = StatusCodes;

interface departmentRequest extends Request {
    body: {
        department: Department;
    };
}

/******************************************************************************
 *          POST Request - Create - /api/department/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: departmentSchema }),
    async (req: departmentRequest, res: Response) => {
        const { name, college } = req.body.department;
        try {
            const result = await createDepartment(name, college.id);
            return result
                ? res.status(CREATED).end()
                : res
                      .status(BAD_REQUEST)
                      .json({ error: 'College provided does not exist' })
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
 *                  GET Request - Read - /api/department/read
 ******************************************************************************/

router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const departments = await getDepartments();
            return res.status(OK).json({ departments }).end();
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
 *              DELETE Request - Delete - /api/department/delete/:id
 ******************************************************************************/

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await deleteDepartment(parseInt(id, 10));
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
