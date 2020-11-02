import { Router } from 'express';
import sampleRouter from './sample';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/sample', sampleRouter);

// Export the base-router
export default router;
