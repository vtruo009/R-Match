import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { IStudent } from '@entities/student';
import { errors } from '@shared/errors';
import { updateStudent, applyJob } from '@modules/student';
import { JWTStudent } from '@entities/user';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface studentRequest extends Request {
    body: {
        student: IStudent;
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
 *          POST Request - Update - /api/student/apply-job
 ******************************************************************************/

router.post('/apply-job',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        //checks that caller is a faculty member
        const { role, studentId } = req.user as JWTStudent;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }
        console.log("STUDENT:" + studentId + "\n");
        const { jobId } = req.body;

        // Check if required field is missing.
        if (!jobId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

    try {
        const applyJobResult = await applyJob(
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
