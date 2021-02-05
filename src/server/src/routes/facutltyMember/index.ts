import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { FacultyMember } from '@entities/facultyMember';
import { errors } from '@shared/errors';
import {
    getFacultyMemberProfile,
    updateFacultyMember,
    getPostedJobs
} from '@modules/facultyMember';
import { validationMiddleware } from '@middlewares/validation';
import {
    facultyMemberProfileSchema,
    getPostedJobsSchema
} from './schemas';
import { JWTUser } from '@entities/user';

const router = Router();
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface facultyMemberRequest extends Request {
    body: {
        facultyMemberProfile: FacultyMember;
    };
}

/******************************************************************************
 *   POST Request - Update Profile - /api/faculty-member/update-profile
 ******************************************************************************/

router.post(
    '/update-profile',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: facultyMemberProfileSchema }),
    async (req: facultyMemberRequest, res: Response) => {
        const { specificUserId, role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }

        const {
            user,
            departmentId,
            websiteLink,
            office,
            title,
            id,
        } = req.body.facultyMemberProfile;

        if (specificUserId !== id) {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not owner of the profile' });
        }
        try {
            const updateResult = await updateFacultyMember(
                id,
                user,
                departmentId,
                websiteLink,
                office,
                title
            );
            return updateResult
                ? res.status(OK).end()
                : res
                      .status(BAD_REQUEST)
                      .json({
                          error:
                              "Faculty member's id  provided does not belong to any record",
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
 * GET Request - Read - "GET /api/faculty-member/get-profile/:facultyMemberId"
 ******************************************************************************/

router.get(
    '/get-profile/:facultyMemberId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { facultyMemberId } = req.params;
        try {
            const facultyMember = await getFacultyMemberProfile(
                parseInt(facultyMemberId, 10)
            );
            return res.status(OK).json({ facultyMember }).end();
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
 * GET Request - Read - "GET /api/faculty-member/get-posted-jobs"
 ******************************************************************************/
interface GetPostedJobsRequest extends Request {
    query: {
        page: string;
        numOfItems: string;
    };
}

router.get(
    '/get-posted-jobs',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: getPostedJobsSchema }),
    async (req: GetPostedJobsRequest, res: Response) => {
        const { specificUserId, role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }

        const { page, numOfItems } = req.query;

        try {
            const getPostedJobsResult = await getPostedJobs(
                specificUserId,
                parseInt(page),
                parseInt(numOfItems)
            );
            if (getPostedJobsResult) {
                const [jobs, jobsCount] = getPostedJobsResult;
                return res.status(OK).json({ jobs, jobsCount }).end();
            } else {
                return res
                    .status(BAD_REQUEST)
                    .json({
                        error:
                            "Faculty member's id  provided does not belong to any record",
                    })
                    .end();
            }
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
