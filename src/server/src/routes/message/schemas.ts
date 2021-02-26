import Joi from 'joi';

export const sendMessageSchema = Joi.object({
    content: Joi.string().required(),
    receiverId: Joi.number().required()
});

export const getMessagesSchema = Joi.object({
    messangerId: Joi.string().required(),
    page: Joi.string().required(),
});
