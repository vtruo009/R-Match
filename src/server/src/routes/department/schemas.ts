import Joi from 'joi';

export const departmentSchema = Joi.object({
    department: Joi.object({
        name: Joi.string().required(),
        college: Joi.object({
            id: Joi.number().required(),
        }).required(),
    }).required(),
});
