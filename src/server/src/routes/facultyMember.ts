import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { IFacultyMember } from '@entities/facultyMember';
import { errors } from '@shared/errors';
import {
    getFacultyMemberProfile,
    updateFacultyMember,
} from '@modules/facultyMember';

const router = Router();

const { BAD_REQUEST, CREATED, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

interface facultyMemberRequest extends Request {
    body: {
        facultyMember: IFacultyMember;
    };
}

/******************************************************************************
 *   POST Request - Update Profile - /api/facultyMember/update-profile
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
 * GET Request - Read - "GET /api/facultyMember/get-profile/:facultyMemberId"
 ******************************************************************************/

router.get('/get-profile/:facultyMemberId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { facultyMemberId } = req.params;

        if (!facultyMemberId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

        try {
            const facultyMember = await getFacultyMemberProfile(parseInt(facultyMemberId, 10));
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
