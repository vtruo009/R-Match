import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import logger from '@shared/Logger';
const { UNPROCESSABLE_ENTITY } = StatusCodes;

type JoiObject = Joi.ObjectSchema<Record<string, unknown>>;
interface ValidationSchemas {
    bodySchema?: JoiObject;
    paramsSchema?: JoiObject;
    querySchema?: JoiObject;
}

export function validationMiddleware(schemas: ValidationSchemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body, params, query } = req;
            const { bodySchema, paramsSchema, querySchema } = schemas;

            const isThereValidation = bodySchema || paramsSchema || querySchema;

            if (!isThereValidation) {
                throw Error(
                    'No validation schema provided in joi middleware. Please provide opne'
                );
            }

            if (bodySchema) Joi.assert(body, bodySchema);
            if (paramsSchema) Joi.assert(params, paramsSchema);
            if (querySchema) Joi.assert(query, querySchema);
            next();
        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                const message = error.details
                    .map((detailsMsgs) => detailsMsgs.message)
                    .join(',');

                res.status(UNPROCESSABLE_ENTITY).json({
                    error: message,
                });
            } else {
                logger.err(error);
                next(error);
            }
        }
    };
}
