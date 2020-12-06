import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IJob } from '@entities/job';
import { errors } from '@shared/errors';
import { createJob, updateJob, deleteJob, getJobs } from '@modules/job';
import logger from '@shared/Logger';

const router = Router();

const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

interface jobRequest extends Request {
    body: {
        job: IJob;
    };
}

/******************************************************************************
 *            POST Request example - Create - "POST /api/job/create"
 ******************************************************************************/

router.post('/create', async (req: jobRequest, res: Response) => {
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
        await createJob(targetYears,
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
            departmentId);
        return res.status(CREATED).end();
    } catch (error) {
        logger.err(error);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(errors.internalServerError)
            .end();
    }
});

router.get('/read', async (req: Request, res: Response) => {
    let { title, type, startDate, minSalary, hoursPerWeek, page, numOfItems } = req.query as {
        title: string;
        type: string;
        startDate: string;
        minSalary: string;
        hoursPerWeek: string;
        page: string;
        numOfItems: string;
    };

    try {
        // if (!minSalary && !type && !hoursPerWeek && !startDate) {
        //     const jobs = await getJobs(title, [''], new Date(), 0, 0);
        //     return res.status(OK).json({ jobs }).end();
        // }
        
        let types: string[] = [''];
        // If user doesn't provide title then now it needs to be set to empty string.
        // Otherwise I get an error
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
        // add check to default numOfItems
        const [jobs, jobsCount] = await getJobs(
            title,
            types,
            startDate,
            parseInt(minSalary),
            parseInt(hoursPerWeek),
            parseInt(page),
            parseInt(numOfItems),
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
 *             POST Request example - Update - "POST /api/job/update"
 ******************************************************************************/

router.post('/update', async (req: jobRequest, res: Response) => {
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
        id,
    } = job;
    if (!job) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
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
 *        DELETE Request example - Delete - "DELETE /api/job/delete/:id"
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
