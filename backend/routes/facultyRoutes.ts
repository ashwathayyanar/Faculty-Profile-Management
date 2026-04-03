import express from 'express';
import { getAllFaculty, addFaculty, getFacultyById, deleteFaculty, updateFaculty } from '../controllers/facultyController.js';

const router = express.Router();

router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.post('/', addFaculty);
router.delete('/:id', deleteFaculty);
router.put('/:id', updateFaculty);

export default router;
