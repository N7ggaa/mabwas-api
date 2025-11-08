import express from 'express';
import { upload, list, listByUser } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';
import uploadMiddleware from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(protect, list);
router.route('/user/:userId').get(protect, listByUser);
router.route('/upload').post(protect, uploadMiddleware.single('media'), upload);

export default router;