import Joi from 'joi';

const sampleBaseSchema = Joi.object({
    message: Joi.string().required(),
    num: Joi.number().required(),
}).required();

export const sampleCreatSchema = Joi.object({
    sample: sampleBaseSchema,
});

export const sampleUpdateSchema = Joi.object({
    sample: sampleBaseSchema.keys({
        id: Joi.number().required(),
    }),
});
