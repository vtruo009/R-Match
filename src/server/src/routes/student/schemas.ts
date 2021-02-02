import Joi from 'joi';
import { userProfileSchema } from '../user/schemas';

export const studentProfileSchema = Joi.object({
    studentProfile: Joi.object({
        user: userProfileSchema,
        id: Joi.number().required(),
        departmentId: Joi.number().optional(),
        sid: Joi.string().optional().allow(null).allow(''),
        classStanding: Joi.string()
            .valid('Freshman', 'Sophomore', 'Junior', 'Senior')
            .optional()
            .allow(null),
        courses: Joi.array()
            .items(Joi.object().keys({ id: Joi.number().required() }))
            .optional(),
        transcript: Joi.any().optional().allow(null),
        resume: Joi.any().optional().allow(null),
    }).required(),
});

export const studentSearchSchema = Joi.object({
    firstName: Joi.string().allow('').optional(),
    lastName: Joi.string().allow('').optional(),
    email: Joi.string().allow('').optional(),
    sid: Joi.string().allow('').optional(),
    departmentIds: Joi.array().allow('').items(Joi.number()).required(),
    classStandings: Joi.array().allow('')
        .items(Joi.string().valid('Freshman', 'Sophmore', 'Junior', 'Senior'))
        .required(),
    page: Joi.string().required(),
    numOfItems: Joi.string().required(),
});