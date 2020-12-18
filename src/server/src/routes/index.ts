import { Router } from 'express';
import sampleRouter from './Sample';
import jobRouter from './job';
import facultyMemberRouter from './facutltyMember';
import studentRouter from './student';
import userRouter from './user';
import collegeRouter from './college';
import departmentRouter from './department';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/sample', sampleRouter);
router.use('/job', jobRouter);
router.use('/faculty-member', facultyMemberRouter);
router.use('/student', studentRouter);
router.use('/user', userRouter);
router.use('/college', collegeRouter);
router.use('/department', departmentRouter);
// Export the base-router
export default router;
