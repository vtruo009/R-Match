import Joi from 'joi';

export const sendMessageSchema = Joi.object({
    message: Joi.string().required(),
    receiverId: Joi.number().required()
});
