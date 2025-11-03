import express from 'express';
import { upload, list } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';
import uploadMiddleware from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(protect, list);
router.route('/upload').post(protect, uploadMiddleware.single('file'), upload);

export default router;