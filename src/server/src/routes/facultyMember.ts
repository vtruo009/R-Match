import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IFacultyMember } from '@entities/facultyMember';
import { errors } from '@shared/errors';
import {
    createFacultyMember, updateFacultyMember,
} from '@modules/facultyMember';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface facultyMemberRequest extends Request {
    body: {
        facultyMember: IFacultyMember;
    };
}

/******************************************************************************
 *   POST Request example - Update - "POST /api/facultyMemberProfile/update"
 ******************************************************************************/

router.post('/update', async (req: facultyMemberRequest, res: Response) => {
    const { facultyMember } = req.body;
    const {
        user,
        departmentId,
        websiteLink,
        office,
        title,
        id
    } = facultyMember;

    if (!facultyMember) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    // Check if required field is missing.
    if (!id ||
        !user ||
        !user.id ||
        !user.email ||
        !user.password ||
        !user.firstName ||
        !user.lastName ||
        !user.role) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    try {
        await updateFacultyMember(
            user,
            departmentId,
            websiteLink,
            office,
            title,
            id);
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
