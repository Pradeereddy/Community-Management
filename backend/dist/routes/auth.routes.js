"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// router.post('/login', (req: Request, res: Response) => login(req, res));
// router.post('/register', registerValidation, validateRequest, (req: Request, res: Response) => register(req :Request, res:Response));
// Public routes
router.post('/login', authController_1.login);
router.post('/register', validation_middleware_1.registerValidation, authController_1.register);
// Protected routes
// router.get('/me', authenticateToken, getCurrentUser);
// router.put('/password', authenticateToken, updatePasswordValidation, validateRequest, updatePassword);
// router.put('/profile', authenticateToken, updateProfileValidation, validateRequest, updateProfile);
exports.default = router;
