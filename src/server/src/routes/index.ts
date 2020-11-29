import { Router } from 'express';
import sampleRouter from './sample';
import jobRouter from './job';
import facultyMemberRouter from './facultyMember';
import userRouter from './user';
import facultyMemberRouter from './facultyMember';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/sample', sampleRouter);
router.use('/job', jobRouter);
router.use('/facultyMemberProfile', facultyMemberRouter);
router.use('/user', userRouter);
router.use('/facultyMemberProfile', facultyMemberRouter);
// Export the base-router
export default router;
