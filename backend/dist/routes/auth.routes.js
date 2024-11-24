"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validate_request_middleware_1 = require("../middleware/validate-request.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', authController_1.login);
router.post('/register', validation_middleware_1.registerValidation, validate_request_middleware_1.validateRequest, authController_1.register);
// Protected routes
router.get('/me', auth_middleware_1.authenticateToken, authController_1.getCurrentUser);
router.put('/password', auth_middleware_1.authenticateToken, validation_middleware_1.updatePasswordValidation, validate_request_middleware_1.validateRequest, authController_1.updatePassword);
router.put('/profile', auth_middleware_1.authenticateToken, validation_middleware_1.updateProfileValidation, validate_request_middleware_1.validateRequest, authController_1.updateProfile);
exports.default = router;
