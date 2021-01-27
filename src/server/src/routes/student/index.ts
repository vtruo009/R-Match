import StatusCodes from 'http-status-codes';
import passport from 'passport';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import { Student, classStandings  } from '@entities/student';
import { errors } from '@shared/errors';
import {
    updateStudent,
    getStudentProfile,
    getJobApplications,
    searchStudents
} from '@modules/student';
import { JWTUser } from '@entities/user';
import { validationMiddleware } from '@middlewares/validation';
import { studentProfileSchema, studentSearchSchema  } from './schemas';

const router = Router();
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;

interface studentRequest extends Request {
    body: {
        studentProfile: Student;
    };
}

/******************************************************************************
 *          POST Request - Update - /api/student/update-profile
 ******************************************************************************/

router.post(
    '/update-profile',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: studentProfileSchema }),
    async (req: studentRequest, res: Response) => {
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
            const jobApplications = await getJobApplications(specificUserId);
            return jobApplications
                ? res.status(OK).json({ jobApplications }).end()
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
 *            GET Request - Search - /api/student/search"
 ******************************************************************************/

interface StudentSearchRequest extends Request {
    query: {
        firstName?: string;
        lastName?: string;
        email?: string;
        sid?: string;
        departmentIds?: string[];
        classStandings?: classStandings[];
        page: string;
        numOfItems: string;
    };
}

router.get(
    '/search',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: studentSearchSchema }),
    async (req: StudentSearchRequest, res: Response) => {
        const { departmentIds, page, numOfItems } = req.query;
        let { firstName, lastName, email, sid, classStandings } = req.query;

        if (!firstName) firstName = "";
        if (!lastName) lastName = "";
        if (!email) email = "";
        if (!sid) sid = "";
        var departmentIdInts = [];
        // Pass -1 when the input is empty because it causes a sql parse error
        // when we pass in an empty array.
        if (!departmentIds) departmentIdInts = [-1];
        else {
            for (const id of departmentIds) {
                departmentIdInts.push(parseInt(id));
            }
        }
        if (!classStandings) classStandings = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

        try {
            const [students, studentsCount] = await searchStudents(
                firstName,
                lastName,
                email,
                sid,
                departmentIdInts,
                classStandings,
                parseInt(page),
                parseInt(numOfItems)
            );
            return res.status(OK).json({ students, studentsCount }).end();
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
