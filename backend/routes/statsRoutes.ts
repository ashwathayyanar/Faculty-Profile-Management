import express from 'express';
import { getGlobalStats } from '../controllers/statsController.ts';

const router = express.Router();

router.get('/', getGlobalStats);

export default router;
