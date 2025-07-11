import { Router } from 'express';
import { storeEmail, verifyOtp } from '../controller/user.controller.js';

const router = Router();

router.post('/store-email', storeEmail);
router.post('/verify-otp', verifyOtp)

export default router;