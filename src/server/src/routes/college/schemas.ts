import Joi from 'joi';

export const collegeSchema = Joi.object({
    college: Joi.object({
        name: Joi.string().required(),
    }).required(),
});
