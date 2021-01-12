import Joi from 'joi';

const baseMessage = Joi.object({
    message: Joi.string().required()
}).required();

export const messageSendSchema = Joi.object({
    message: baseMessage
});