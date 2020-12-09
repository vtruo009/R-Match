import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IFacultyMember } from '@entities/facultyMember';
import { errors } from '@shared/errors';
import {
    getFacultyMemberProfile,
    updateFacultyMember,
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
 *   POST Request example - Update - "POST /api/facultyMember/update-profile"
 ******************************************************************************/

router.post(
    '/update-profile',
    async (req: facultyMemberRequest, res: Response) => {
        const { facultyMember } = req.body;

        if (!facultyMember) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

        const {
            user,
            department,
            websiteLink,
            office,
            title,
            id,
        } = facultyMember;

        // Check if required field is missing.
        if (!id || !user || !user.id || !user.firstName || !user.lastName) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

        try {
            const updateResult = await updateFacultyMember(
                user,
                department,
                websiteLink,
                office,
                title,
                id
            );
            if (updateResult) {
                return res.status(OK).end();
            }
            return res
                .status(BAD_REQUEST)
                .json({
                    error:
                        'Faculty member provided does not belong to any record',
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
 *          GET Request - Read - "GET /api/facultyMember/get-profile"
 ******************************************************************************/

router.get('/get-profile', async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

        const facultyMember = await getFacultyMemberProfile(id);
        return res.status(OK).json({ facultyMember }).end();
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
