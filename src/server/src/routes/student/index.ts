import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { Student } from '@entities/student';
import { errors } from '@shared/errors';
import {
    updateStudent,
    getStudentProfile,
    applyToJob,
    getJobApplications,
} from '@modules/student';
import { JWTUser } from '@entities/user';
import { validationMiddleware } from '@middlewares/validation';
import { studentProfileSchema, applyToJobSchema } from './schemas';

const router = Router();
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface studentRequest extends Request {
    body: {
        studentProfile: Student;
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

router.post(
    '/update-profile',
    validationMiddleware({ bodySchema: studentProfileSchema }),
    passport.authenticate('jwt', { session: false }),
    async (req: studentRequest, res: Response) => {
        // Output body of request for visualization purposes
        console.log(req.body.studentProfile);
        const { specificUserId, role } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }

        const {
            user,
            departmentId,
            sid,
            classStanding,
            courses,
            id,
            resume,
            transcript,
        } = req.body.studentProfile;

        if (specificUserId !== id) {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not owner of the profile' });
        }

        try {
            const updateResult = await updateStudent(
                id,
                user,
                departmentId,
                sid,
                classStanding,
                courses,
                transcript,
                resume
            );

            return updateResult
                ? res.status(OK).end()
                : res
                      .status(BAD_REQUEST)
                      .json({
                          error:
                              "Student's id provided does not belong to any record",
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
 *          GET Request - Read - "GET /api/student/get-profile/:studentId"
 ******************************************************************************/

router.get(
    '/get-profile/:studentId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const { studentId } = req.params;
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
    '/apply-to-job',
    validationMiddleware({ bodySchema: applyToJobSchema }),
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
        try {
            const { result, message } = await applyToJob(specificUserId, jobId);
            return result
                ? res.status(OK).end()
                : res.status(BAD_REQUEST).json({ error: message });
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
 *          GET Request - Read - "GET /api/student/get-applied-job"
 ******************************************************************************/

router.get(
    '/get-applied-jobs',
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
            return jobs
                ? res.status(OK).json({ jobs }).end()
                : res
                      .status(BAD_REQUEST)
                      .json({ error: 'Student does not exist' });
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
