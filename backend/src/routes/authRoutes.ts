import { Router } from 'express';
import { register, login } from '../controllers/authController.js'; // Note the mandatory .js extension

const router = Router();

// Public routes for user onboarding and session generation
router.post('/register', register);
router.post('/login', login);

export default router;