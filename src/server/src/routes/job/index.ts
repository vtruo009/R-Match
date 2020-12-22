import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { Job } from '@entities/job';
import { errors } from '@shared/errors';
import { createJob, updateJob, deleteJob, getJobs } from '@modules/job';
import { JWTUser } from '@entities/user';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import { jobCreateSchema, jobUpdateSchema, jobReadSchema } from './schemas';

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

/******************************************************************************
 *            POST Request - Create - /api/job/create
 ******************************************************************************/

router.post(
    '/create',
    validationMiddleware({ bodySchema: jobCreateSchema }),
    passport.authenticate('jwt', { session: false }),
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
    validationMiddleware({ querySchema: jobReadSchema }),
    passport.authenticate('jwt', { session: false }),
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
                startDate = '01/01/3000';
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
    validationMiddleware({ bodySchema: jobUpdateSchema }),
    passport.authenticate('jwt', { session: false }),
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

// TODO: Needs to delete joh applications related to the job as well
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

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
