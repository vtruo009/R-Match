import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IJob } from '@entities/job';
import { errors } from '@shared/errors';
import {
    createJob,
    updateJob,
    deleteJob,
    getJobs,
} from '@modules/job';
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
    if (!targetYears ||
        !hoursPerWeek ||
        !description ||
        !startDate ||
        !type ||
        !title ||
        !status ||
        minSalary === undefined ||
        !departmentId) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    try {
        // Check if required field is missing.
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

    let {title, type, startDate, minSalary, hoursPerWeek, page, itemsPerPage} = req.query as {
        title: string,
        type: string,
        startDate: string,
        endDate: string,
        minSalary: string,
        hoursPerWeek: string,
        page: string,
        itemsPerPage: string,
    }

    try {
        if (!minSalary && !type && !hoursPerWeek && !startDate) {
            const jobs = await getJobs(title, [''], new Date(), 0, 0, parseInt(page), parseInt(itemsPerPage));
            return res.status(OK).json({jobs}).end();
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
        let types: string[] = [''];
        if (type) {
            types = type.split(',');
        }
        const jobs = await getJobs(title, types, new Date(startDate), parseInt(minSalary), parseInt(hoursPerWeek), parseInt(page), parseInt(itemsPerPage));
        return res.status(OK).json({jobs}).end();

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
    const { targetYears,
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
        id } = job;
    if (!job) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissingError,
        });
    }
    if (!id ||
        !targetYears ||
        !hoursPerWeek ||
        !description ||
        !startDate ||
        !type ||
        !title ||
        !status ||
        minSalary === undefined ||
        !departmentId) {
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
            id);
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
