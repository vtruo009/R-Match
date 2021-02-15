import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';

import { Job } from '@entities/job';
import { classStandings, classStandingValues } from '@entities/student';
import { errors } from '@shared/errors';
import {
    createJob,
    updateJob,
    deleteJob,
    getJobs,
    closeJob,
    openJob,
    applyToJob,
    getApplicants,
    getNewJobs,
    getRecommendedJobs,
    getNumberApplicants,
} from '@modules/job';
import { JWTUser } from '@entities/user';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import {
    jobCreateSchema,
    jobUpdateSchema,
    jobReadSchema,
    jobIdSchema,
    getApplicantsSchema,
    getNewJobsSchema,
} from './schemas';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;

interface jobRequest extends Request {
    body: {
        job: Job;
    };
}

interface jobIdRequest extends Request {
    body: {
        jobId: number;
    };
}
/******************************************************************************
 *            POST Request - Create - /api/job/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: jobCreateSchema }),
    async (req: jobRequest, res: Response) => {
        //checks that caller is a faculty member
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }

        const {
            targetYears,
            hoursPerWeek,
            description,
            expirationDate,
            startDate,
            endDate,
            type,
            title,
            minSalary,
            maxSalary,
            departmentId,
        } = req.body.job;

        try {
            const { result, message } = await createJob(
                targetYears,
                hoursPerWeek,
                description,
                expirationDate,
                startDate,
                endDate,
                type,
                title,
                minSalary,
                maxSalary,
                departmentId,
                specificUserId
            );
            return result
                ? res.status(CREATED).end()
                : res.status(BAD_REQUEST).json({ error: message }).end();
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
 *            GET Request - Read - /api/job/read
 ******************************************************************************/

interface JobReadRequest extends Request {
    query: {
        title: string;
        types: string[];
        startDate?: string;
        minSalary?: string;
        hoursPerWeek?: string;
        page: string;
        numOfItems: string;
    };
}

router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: jobReadSchema }),
    async (req: JobReadRequest, res: Response) => {
        //checks that caller is a student.
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }

        const { title, types, page, numOfItems } = req.query;
        let { startDate, minSalary, hoursPerWeek } = req.query;

        try {
            if (!minSalary) {
                minSalary = '10000';
            }
            if (!hoursPerWeek) {
                hoursPerWeek = '10000';
            }
            if (!startDate) {
                startDate = '01/01/3000';
            }

            const getJobsResult = await getJobs(
                specificUserId,
                title,
                types,
                startDate,
                parseInt(minSalary),
                parseInt(hoursPerWeek),
                parseInt(page),
                parseInt(numOfItems)
            );

            if (getJobsResult) {
                const [jobs, jobsCount] = getJobsResult;
                return res.status(OK).json({ jobs, jobsCount }).end();
            }
            return res
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
 *             POST Request - Update - /api/job/update
 ******************************************************************************/

router.post(
    '/update',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: jobUpdateSchema }),
    async (req: jobRequest, res: Response) => {
        const { role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { job } = req.body;
        try {
            const { result, message } = await updateJob(job);
            return result
                ? res.status(OK).end()
                : res.status(BAD_REQUEST).json({ error: message }).end();
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
 *              DELETE Request - Delete - /api/job/delete/:id
 ******************************************************************************/

router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: jobRequest, res: Response) => {
        const { role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { id } = req.params;
        try {
            await deleteJob(parseInt(id, 10));
            return res.status(OK).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

router.post(
    '/close/:jobId',
    passport.authenticate('jwt', { session: false }),
    async (req: jobIdRequest, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { jobId } = req.params;
        try {
            await closeJob(parseInt(jobId, 10), specificUserId);
            return res.status(OK).end();
        } catch (error) {
            logger.err(error);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json(errors.internalServerError)
                .end();
        }
    }
);

router.post(
    '/open/:jobId',
    passport.authenticate('jwt', { session: false }),
    async (req: jobIdRequest, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { jobId } = req.params;
        try {
            await openJob(parseInt(jobId, 10), specificUserId);
            return res.status(OK).end();
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
 *          POST Request - Apply Job - /api/job/apply-job
 ******************************************************************************/

router.post(
    '/apply-to-job/:jobId',
    passport.authenticate('jwt', { session: false }),
    async (req: jobIdRequest, res: Response) => {
        //checks that caller is a student.
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }
        const { jobId } = req.params;
        try {
            const { result, message } = await applyToJob(
                specificUserId,
                parseInt(jobId, 10)
            );
            return result
                ? res.status(OK).end()
                : res.status(BAD_REQUEST).json({ message });
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
 *   GET Request - Get Applicants - "GET /api/faculty-member/get-applicants"
 ******************************************************************************/

interface GetApplicantsRequest extends Request {
    query: {
        jobId: string;
        departmentIds: string[];
        classStandings: classStandings[];
        minimumGpa?: string;
        page: string;
        numOfItems: string;
    };
}

router.get(
    '/get-applicants',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: getApplicantsSchema }),
    async (req: GetApplicantsRequest, res: Response) => {
        const { specificUserId, role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }

        const { jobId, departmentIds, page, numOfItems } = req.query;
        let { classStandings, minimumGpa } = req.query;

        // Pass -1 when the input is empty or null because it causes a sql parse error
        // when we pass in an empty array.
        const departmentIdInts =
            departmentIds && departmentIds.length > 0
                ? departmentIds.map((id) => parseInt(id, 10))
                : [-1];

        if (!classStandings || classStandings.length === 0)
            classStandings = classStandingValues;

        if (!minimumGpa || minimumGpa === '') minimumGpa = '0';

        try {
            const { result, message, count } = await getApplicants(
                specificUserId,
                parseInt(jobId, 10),
                departmentIdInts,
                classStandings,
                parseFloat(minimumGpa),
                parseInt(page, 10),
                parseInt(numOfItems, 10)
            );
            return result
                ? res
                      .status(OK)
                      .json({
                          jobApplicants: result,
                          jobApplicantsCount: count,
                      })
                      .end()
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
 *   GET Request - Get Number of Applicants - "GET /api/faculty-member/get-number-of-applicants"
 ******************************************************************************/
router.get(
    '/get-number-of-applicants/:jobId',
    passport.authenticate('jwt', { session: false }),
    async (req: GetApplicantsRequest, res: Response) => {
        const { role } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }
        const { jobId } = req.params;
        try {
            const numberOfApplicants = await getNumberApplicants(
                parseInt(jobId, 10)
            );
            return res
                .status(OK)
                .json({
                    numberOfApplicants,
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
 *            GET Request - Get New Job - /api/job/get-new-jobs
 ******************************************************************************/

interface GetNewJobsRequest extends Request {
    query: {
        page: string;
        numOfItems: string;
    };
}

router.get(
    '/get-new-jobs',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: getNewJobsSchema }),
    async (req: GetNewJobsRequest, res: Response) => {
        //checks that caller is a student.
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'student') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a student' });
        }

        const { page, numOfItems } = req.query;

        try {
            const [jobs, jobsCount] = await getNewJobs(
                specificUserId,
                parseInt(page),
                parseInt(numOfItems)
            );
            return res.status(OK).json({ newJobs: jobs, jobsCount }).end();
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
 *       GET Request - Get Recommended Jobs - /api/job/get-recommended-jobs
 ******************************************************************************/

router.get(
    '/get-recommended-jobs',
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
            const recommendedJobs = await getRecommendedJobs(specificUserId);
            return res.status(OK).json({ recommendedJobs }).end();
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
