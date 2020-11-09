import { Router } from 'express';
import sampleRouter from './sample';
import jobRouter from './job';;

// Init router and path
const router = Router();

// Add sub-routes
router.use('/sample', sampleRouter);
router.use('/job', jobRouter);

// Export the base-router
export default router;
