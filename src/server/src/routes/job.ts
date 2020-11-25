import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IJob } from '@entities/job';
import { errors } from '@shared/errors';
import {
    createJob,
    getJobs,
} from '@modules/job';
import logger from '@shared/Logger';
import { parse } from 'path';
import { start } from 'repl';

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
        departmentId } = job;
    if (!job) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    try {
        // Check if required field is missing.
        if (!targetYears || !hoursPerWeek || !description || !startDate || !type
            || !title || !status || !minSalary || !departmentId) {
            return res.status(BAD_REQUEST).json({
                error: errors.paramMissingError,
            });
        }

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

    let {title, startDate, minSalary, hoursPerWeek} = req.query as {
        title: string,
        startDate: string,
        endDate: string,
        minSalary: string,
        hoursPerWeek: string,
    }

    try {
        if (!minSalary) {
            minSalary = '10000';
        }
        if (!hoursPerWeek) {
            hoursPerWeek = '10000';
        }
        if (!startDate) {
            startDate = new Date().getMonth()+1 + '/' + new Date().getDate() + '/' + new Date().getFullYear(); 
        }
        const jobs = await getJobs(title, new Date(startDate), parseInt(minSalary), parseInt(hoursPerWeek));
        return res.status(OK).json({jobs}).end();
    }
    catch (error) {
        logger.err(error);
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(errors.internalServerError)
            .end();
    }
})
/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
