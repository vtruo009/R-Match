import StatusCodes from 'http-status-codes';
import passport from 'passport';
import { Request, Response, Router } from 'express';
import { IJob } from '@entities/job';
import { errors } from '@shared/errors';
import { createJob, updateJob, deleteJob, getJobs } from '@modules/job';
import { JWTFacultyMember } from '@entities/user';
import logger from '@shared/Logger';

const router = Router();

const {
    BAD_REQUEST,
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
} = StatusCodes;

interface jobRequest extends Request {
    body: {
        job: IJob;
    };
}

/******************************************************************************
 *            POST Request - Create - /api/job/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    async (req: jobRequest, res: Response) => {
        //checks that caller is a faculty member
        const { role, facultyMemberId } = req.user as JWTFacultyMember;
        if (role !== 'facultyMember') {
            return res
                .status(UNAUTHORIZED)
                .json({ error: 'User is not a faculty member' });
        }

        const { job } = req.body;
        const {
            targetYears,
            hoursPerWeek,
            description,
            expirationDate,
            startDate,
            endDate,
            type,
            title,
            status,
            minSalary,
            maxSalary,
            departmentId,
        } = job;
        if (!job) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }
        if (
            !targetYears ||
            !hoursPerWeek ||
            !description ||
            !startDate ||
            !type ||
            !title ||
            !status ||
            minSalary === undefined ||
            !departmentId
        ) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }
        try {
            await createJob(
                targetYears,
                hoursPerWeek,
                description,
                expirationDate,
                startDate,
                endDate,
                type,
                title,
                status,
                minSalary,
                maxSalary,
                departmentId,
                facultyMemberId
            );
            return res.status(CREATED).end();
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

router.get('/read', async (req: Request, res: Response) => {
    let {
        title,
        type,
        startDate,
        minSalary,
        hoursPerWeek,
        page,
        numOfItems,
    } = req.query as {
        title: string;
        type: string;
        startDate: string;
        minSalary: string;
        hoursPerWeek: string;
        page: string;
        numOfItems: string;
    };

    try {
        let types: string[] = [''];
        if (!title) {
            title = '';
        }
        if (!minSalary) {
            minSalary = '10000';
        }
        if (!hoursPerWeek) {
            hoursPerWeek = '10000';
        }
        if (!startDate) {
            startDate = '01/01/3000';
        }
        if (type) {
            types = type.split(',');
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
});

/******************************************************************************
 *             POST Request - Update - /api/job/update
 ******************************************************************************/

router.post('/update', async (req: jobRequest, res: Response) => {
    const { job } = req.body;

    if (!job) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
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
        status,
        minSalary,
        maxSalary,
        departmentId,
        id,
    } = job;

    if (
        !id ||
        !targetYears ||
        !hoursPerWeek ||
        !description ||
        !startDate ||
        !type ||
        !title ||
        !status ||
        minSalary === undefined ||
        !departmentId
    ) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    try {
        await updateJob(
            targetYears,
            hoursPerWeek,
            description,
            expirationDate,
            startDate,
            endDate,
            type,
            title,
            status,
            minSalary,
            maxSalary,
            departmentId,
            id
        );
        return res.status(OK).end();
    } catch (error) {
        logger.err(error);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(errors.internalServerError)
            .end();
    }
});

/******************************************************************************
 *        DELETE Request - Delete - /api/job/delete/:id
 ******************************************************************************/

router.delete('/delete/:id', async (req: jobRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
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
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
