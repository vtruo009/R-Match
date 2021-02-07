import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { WorkExperience } from '@entities/workExperience';
import { errors } from '@shared/errors';
import passport from 'passport';
import {
    createWorkExperience,
    getWorkExperiences,
    updateWorkExperience,
    deleteWorkExperience
} from '@modules/workExperience';
import logger from '@shared/Logger';
import { validationMiddleware } from '@middlewares/validation';
import { 
    workExperienceCreateSchema,
    workExperienceUpdateSchema,
    workExperienceIdSchema
         } from './schemas';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;

interface workExperienceRequest extends Request {
    body: {
        workExperience: WorkExperience;
    };
}

interface workExperienceIdRequest extends Request {
    body: {
        workExperienceId: number;
    };
}
/******************************************************************************
 *            POST Request - Create - /api/job/create
 ******************************************************************************/

router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: workExperienceCreateSchema }),
    async (req: workExperienceRequest, res: Response) => {
        const {
            startDate,
            endDate, 
            description,
            employer,
            title,
            studentId,
        } = req.body.workExperience;

        try {
            const { result, message } = await createWorkExperience(
                description,
                employer,
                startDate,
                endDate, 
                title,
                studentId,
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
 *                                     Export
 ******************************************************************************/

export default router;