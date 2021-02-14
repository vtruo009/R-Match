import Joi from 'joi';

const baseWorkExperience = Joi.object({
    title: Joi.string().required(),
    employer: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
}).required(); 

export const workExperienceCreateSchema = Joi.object({
    workExperience: baseWorkExperience,
});

export const workExperienceUpdateSchema = Joi.object({
    workExperience: baseWorkExperience.keys({
        id: Joi.number().required(),
    }),
});
