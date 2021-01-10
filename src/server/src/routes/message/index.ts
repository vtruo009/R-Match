import StatusCodes from 'http-status-codes';
import express, { Request, Response, Router } from 'express';

const router = Router();
const {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    BAD_REQUEST,
} = StatusCodes;


router.get('/loadMessage', (req: Request, res: Response) => {
    return res
        .status(OK)
        .json({
            message: [{
                message: 'hello world',
                author: 'gigoro',
                time: "1/2/22"
            }]
        })
        .end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
