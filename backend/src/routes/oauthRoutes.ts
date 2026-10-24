import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { handleOAuthCallback } from '../controllers/oauthController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Catch-all route for OAuth callbacks
router.get('/callback/:provider', handleOAuthCallback);

export default router;
