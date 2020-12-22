import Joi from 'joi';
import { userProfileSchema } from '../user/schemas';

export const studentProfileSchema = Joi.object({
    studentProfile: Joi.object({
        user: userProfileSchema,
        id: Joi.number().required(),
        departmentId: Joi.number().optional(),
        sid: Joi.number().optional(),
        classStanding: Joi.string()
            .valid('Freshman', 'Sophomore', 'Junior', 'Senior')
            .optional(),
        courses: Joi.array()
            .items(Joi.object().keys({ id: Joi.number().required() }))
            .optional(),
    }).required(),
});

export const applyToJobSchema = Joi.object({
    jobId: Joi.number().required(),
});
