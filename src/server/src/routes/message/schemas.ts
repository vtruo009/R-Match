import Joi from 'joi';
/*
const baseMessage = Joi.object({
    message: Joi.string().required()
}).required();

export const messageSendSchema = Joi.object({
    message: baseMessage
});
*/
import { userProfileSchema } from '../user/schemas';

export const sendMessageSchema = Joi.object({
    message: Joi.string().required(),
    receiverId: Joi.number().required()
});