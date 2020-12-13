import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { IStudent } from '@entities/student';
import { errors } from '@shared/errors';
import {
    updateStudent,
    getStudentProfile,
    applyJob
} from '@modules/student';
import { JWTStudent } from '@entities/user';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface studentRequest extends Request {
    body: {
        student: IStudent;
    };
}

interface studentProfileRequest extends Request {
    body: {
        studentId: number;
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
    const { student } = req.body;

    if (!student) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }

    const { user, department, sid, classStanding, courses, id } = student;

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
 *          GET Request - Read - "GET /api/student/get-profile"
 ******************************************************************************/

router.get('/get-profile',
    passport.authenticate('jwt', { session: false }),
    async (req: studentProfileRequest, res: Response) => {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }
        try {
            const student = await getStudentProfile(studentId);
            return res.status(OK).json({ student }).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
});
  
/******************************************************************************
   *          POST Request - Apply Job - /api/student/apply-job
 ******************************************************************************/

router.post('/apply-job',
    passport.authenticate('jwt', { session: false }),
    async (req: jobApplicationRequest, res: Response) => {
        //checks that caller is a student.
        const { role, studentId } = req.user as JWTStudent;
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
        await applyJob(
            studentId,
            jobId
        );
        return res.status(OK).end();
    } catch (error) {
        logger.err(error);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ error })
            .end();
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
