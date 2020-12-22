import Joi from 'joi';
import { userProfileSchema } from '../user/schemas';

export const facultyMemberProfileSchema = Joi.object({
    facultyMemberProfile: Joi.object({
        user: userProfileSchema,
        id: Joi.number().required(),
        departmentId: Joi.number().optional(),
        websiteLink: Joi.string().allow('').optional(),
        office: Joi.string().allow('').optional(),
        title: Joi.string().allow('').optional(),
    }).required(),
});
