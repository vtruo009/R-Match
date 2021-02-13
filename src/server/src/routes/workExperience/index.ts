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
    workExperienceReadSchema,
    workExperienceUpdateSchema,
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

/******************************************************************************
 *            POST Request - Create - /api/workExperience/create
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
 *            GET Request - Read - /api/workExperience/read
 ******************************************************************************/
router.get(
    '/read',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        const {studentId} = req.params; 
        try {
            // This line of code produces an error (string is not assignable to number)
            // const workExperiences = await getWorkExperiences(studentId);
            return res
                .status(OK)
                .json({
                    WorkExperience,
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
 *             POST Request - Update - /api/workExperience/update
 ******************************************************************************/

router.post(
    '/update',
    passport.authenticate('jwt', { session: false }),
    validationMiddleware({ bodySchema: workExperienceUpdateSchema }),
    async (req: workExperienceRequest, res: Response) => {
        const { workExperience } = req.body;
        try {
            const { result, message } = await updateWorkExperience(workExperience);
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
 *              DELETE Request - Delete - /api/workExperience/delete/:id
 ******************************************************************************/
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: workExperienceRequest, res: Response) => {
        const { id } = req.params;
        try {
            await deleteWorkExperience(parseInt(id, 10));
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