import { Router } from 'express';
import sampleRouter from './Sample';
import jobRouter from './job';
import facultyMemberRouter from './facutltyMember';
import studentRouter from './student';
import userRouter from './user';
import collegeRouter from './college';
import departmentRouter from './department';
import courseRouter from './course';
import messageRouter from './message';
import workExperienceRouter from './workExperience'
import documentRouter from './document';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/sample', sampleRouter);
router.use('/job', jobRouter);
router.use('/faculty-member', facultyMemberRouter);
router.use('/student', studentRouter);
router.use('/user', userRouter);
router.use('/college', collegeRouter);
router.use('/course', courseRouter);
router.use('/department', departmentRouter);
router.use('/message', messageRouter);
router.use('/workExperience', workExperienceRouter); 
router.use('/document', documentRouter);
// Export the base-router
export default router;
