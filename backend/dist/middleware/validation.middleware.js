"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordValidation = exports.updateProfileValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('first_name').trim().notEmpty(),
    (0, express_validator_1.body)('last_name').trim().notEmpty(),
    (0, express_validator_1.body)('phone_number').optional().isMobilePhone('any'),
    (0, express_validator_1.body)('unit_number').optional().trim()
];
exports.updateProfileValidation = [
    (0, express_validator_1.body)('first_name').trim().notEmpty(),
    (0, express_validator_1.body)('last_name').trim().notEmpty(),
    (0, express_validator_1.body)('phone_number').optional().isMobilePhone('any'),
    (0, express_validator_1.body)('unit_number').optional().trim()
];
exports.updatePasswordValidation = [
    (0, express_validator_1.body)('currentPassword').notEmpty(),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 })
];
