import Joi from 'joi';

export const userProfileSchema = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().allow('').allow(null).optional(),
    biography: Joi.string().allow('').allow(null).optional(),
}).required();

export const SignUpSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        // TODO: Figure out how to pass a correct error message when passwords don't match
        confirmedPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid('student', 'facultyMember').required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }).required(),
});
