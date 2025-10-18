import express from 'express';
import { startTest, checkResults, getReport } from '../controllers/testController.js';

const router = express.Router();

router.post('/start', startTest);
router.post('/check/:code', checkResults);
router.get('/report/:code', getReport);

export default router;
