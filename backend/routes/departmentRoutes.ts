import express from 'express';
import { getAllDepartments, updateDepartment } from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.put('/:id', updateDepartment);

export default router;
