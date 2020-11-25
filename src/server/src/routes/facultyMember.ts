import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IFacultyMember } from '@entities/facultyMember';
import { errors } from '@shared/errors';
import {
    createFacultyMember,
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
 *   POST Request example - Create - "POST /api/facultyMemberProfile/create"
 ******************************************************************************/

router.post('/create', async (req: facultyMemberRequest, res: Response) => {
    const { facultyMember } = req.body;
    const {
        email,
        biography,
        firstName,
        middleName,
        lastName,
        departmentId,
        websiteLink,
        office,
        title
    } = facultyMember;
    if (!facultyMember) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    // Check if required field is missing.
    if (!email ||
        !biography ||
        !firstName ||
        !lastName ||
        !departmentId ||
        !websiteLink ||
        !office ||
        !title) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    try {
        await createFacultyMember(
            email,
            biography,
            firstName,
            middleName,
            lastName,
            departmentId,
            websiteLink,
            office,
            title);
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
