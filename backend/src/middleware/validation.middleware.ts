import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone_number').optional().isMobilePhone('any'),
  body('unit_number').optional().trim()
];

export const updateProfileValidation = [
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone_number').optional().isMobilePhone('any'),
  body('unit_number').optional().trim()
];

export const updatePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
]; 