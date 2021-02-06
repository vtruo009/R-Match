import Joi from 'joi';
import { userProfileSchema } from '../user/schemas';

export const facultyMemberProfileSchema = Joi.object({
    facultyMemberProfile: Joi.object({
        user: userProfileSchema,
        id: Joi.number().required(),
        departmentId: Joi.number().optional(),
        websiteLink: Joi.string().allow('').optional().allow(null).allow(''),
        office: Joi.string().allow('').optional().allow(null).allow(''),
        title: Joi.string().allow('').optional().allow(null).allow(''),
    }).required(),
});

export const getPostedJobsSchema = Joi.object({
    page: Joi.string().required(),
    numOfItems: Joi.string().required()
});

export const getApplicantsSchema = Joi.object({
    jobId: Joi.string().required(),
    departmentIds: Joi.array().allow('').items(Joi.number()).required(),
    classStandings: Joi.array()
        .allow('')
        .items(Joi.string().valid('Freshman', 'Sophmore', 'Junior', 'Senior'))
        .required(),
    minimumGpa: Joi.string().optional()
});