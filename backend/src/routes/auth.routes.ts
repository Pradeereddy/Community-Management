import { Router } from 'express';
import { Request, Response } from 'express';
import { login, register, getCurrentUser, updatePassword, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth.middleware';
import { registerValidation, updateProfileValidation, updatePasswordValidation } from '../middleware/validation.middleware';
import { validateRequest } from '../middleware/validate-request.middleware';

const router = Router();
// Public routes
router.post('/login', login);
router.post('/register', registerValidation,validateRequest, register);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/password', authenticateToken, updatePasswordValidation, validateRequest, updatePassword);
router.put('/profile', authenticateToken, updateProfileValidation, validateRequest, updateProfile);

export default router; 