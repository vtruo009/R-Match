import Joi from 'joi';

export const userProfileSchema = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().allow('').allow(null).optional(),
    biography: Joi.string().allow('').allow(null).optional(),
}).required();

export const signUpSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmedPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid('student', 'facultyMember').required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }).required(),
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const emailVerificationSchema = Joi.object({
    verificationKey: Joi.string().required(),
});

export const updateEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});
