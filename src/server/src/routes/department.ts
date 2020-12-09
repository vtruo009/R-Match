import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IDepartment } from '@entities/department';
import { errors } from '@shared/errors';
import { createDepartment } from '@modules/department';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface departmentRequest extends Request {
    body: {
        department: IDepartment;
    };
}

/******************************************************************************
 *          POST Request - Create - /api/department/create
 ******************************************************************************/

router.post('/create', async (req: departmentRequest, res: Response) => {
    const { department } = req.body;

    if (!department) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    const { name, college } = department;

    // Check if required field is missing.
    if (!name || !college || !college.id) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    try {
        await createDepartment(name, college);
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
