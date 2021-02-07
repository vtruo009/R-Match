import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';

import { Job } from '@entities/job';
import { errors } from '@shared/errors';
import {
    createJob,
    updateJob,
    deleteJob,
    getJobs,
    closeJob,
    openJob,
    applyToJob,
    getJobApplications,
} from '@modules/job';
import { JWTUser } from '@entities/user';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import {
    jobCreateSchema,
    jobUpdateSchema,
    jobReadSchema,
    jobIdSchema,
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

// TODO: Filter out jobs that haven applied by a student
router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ querySchema: jobReadSchema }),
    async (req: JobReadRequest, res: Response) => {
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
                startDate = '01/01/2000';
            }

            const [jobs, jobsCount] = await getJobs(
                title,
                types,
                startDate,
                parseInt(minSalary),
                parseInt(hoursPerWeek),
                parseInt(page),
                parseInt(numOfItems)
            );
            return res.status(OK).json({ jobs, jobsCount }).end();
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

// TODO: Needs to delete joh applications related to the job as well. Can't delete jobs if it has applications
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
    '/close',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: jobIdSchema }),
    async (req: jobIdRequest, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { jobId } = req.body;
        try {
            await closeJob(jobId, specificUserId);
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
    '/open',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: jobIdSchema }),
    async (req: jobIdRequest, res: Response) => {
        const { role, specificUserId } = req.user as JWTUser;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' })
                .end();
        }
        const { jobId } = req.body;
        try {
            await openJob(jobId, specificUserId);
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
    '/apply-to-job',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: jobIdSchema }),
    async (req: jobIdRequest, res: Response) => {
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
 * GET Request - Read - "GET /api/job/get-applicants/:jobId"
 ******************************************************************************/
interface GetJobApplicationsRequest extends Request {
    query: {
        page: string;
        numOfItems: string;
    };
}
router.get(
    '/get-job-applicants/:jobId',
    passport.authenticate('jwt', { session: false }),
    async (req: GetJobApplicationsRequest, res: Response) => {
        const { specificUserId, role } = req.user as JWTUser;
        const { page, numOfItems } = req.query;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }
        const { jobId } = req.params;
        try {
            const { result, message, count } = await getJobApplications(
                specificUserId,
                parseInt(jobId, 10),
                parseInt(page),
                parseInt(numOfItems)
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
 *                                     Export
 ******************************************************************************/

export default router;
