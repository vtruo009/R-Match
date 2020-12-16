import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { IStudent } from '@entities/student';
import { errors } from '@shared/errors';
import {
    updateStudent,
    getStudentProfile,
    applyJob,
    getJobApplications
} from '@modules/student';
import { JWTUser } from '@entities/user';

const router = Router();

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface studentRequest extends Request {
    body: {
        studentProfile: IStudent;
    };
}

interface jobApplicationRequest extends Request {
    body: {
        jobId: number;
    };
}

/******************************************************************************
 *          POST Request - Update - /api/student/update-profile
 ******************************************************************************/

router.post('/update-profile', async (req: studentRequest, res: Response) => {
    const { studentProfile } = req.body;

    if (!studentProfile) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    const {
        user,
        department,
        sid,
        classStanding,
        courses,
        id,
    } = studentProfile;

    // Check if required field is missing.
    if (!id || !user || !user.id || !user.firstName || !user.lastName) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    try {
        const updateResult = await updateStudent(
            user,
            department,
            sid,
            classStanding,
            courses,
            id
        );
        if (updateResult) {
            return res.status(OK).end();
        }
        return res
            .status(BAD_REQUEST)
            .json({
                error: 'Student provided does not belong to any record',
            })
            .end();
    } catch (error) {
        logger.err(error);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(errors.internalServerError)
            .end();
    }
});

/******************************************************************************
 *          GET Request - Read - "GET /api/student/get-profile/:studentId"
 ******************************************************************************/

router.get(
    '/get-profile/:studentId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }
        try {
            const student = await getStudentProfile(parseInt(studentId, 10));
            return res.status(OK).json({ student }).end();
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
 *          POST Request - Apply Job - /api/student/apply-job
 ******************************************************************************/

router.post(
    '/apply-job',
    passport.authenticate('jwt', { session: false }),
    async (req: jobApplicationRequest, res: Response) => {
        //checks that caller is a student.
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }
        const { jobId } = req.body;

        // Check if required field is missing.
        if (!jobId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }
        try {
            await applyJob(specificUserId, jobId);
            return res.status(OK).end();
        } catch (error) {
            logger.err(error);
            return res.status(INTERNAL_SERVER_ERROR).json({ error }).end();
        }
    }
);

/******************************************************************************
 *          GET Request - Read - "GET /api/student/get-profile/:studentId"
 ******************************************************************************/

router.get(
    '/get-applied-job',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        //checks that caller is a student.
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }

        try {
            const jobs = await getJobApplications(specificUserId);
            return res.status(OK).json({ jobs }).end();
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
