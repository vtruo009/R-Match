import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { IStudent } from '@entities/student';
import { errors } from '@shared/errors';
import {
    updateStudent,
    getStudentProfile
} from '@modules/student';

const router = Router();

const { BAD_REQUEST, CREATED, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

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
 *                                     Export
 ******************************************************************************/

export default router;
