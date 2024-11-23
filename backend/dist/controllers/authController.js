"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.updatePassword = exports.getCurrentUser = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await database_1.default.query('SELECT * FROM Users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // const isValidPassword = await bcrypt.compare(password, user.password); // Will change
        const isValidPassword = password == user.password;
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)(user.user_id);
        res.json({
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone_number, unit_number } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await database_1.default.query(`INSERT INTO Users (first_name, last_name, email, password, phone_number, unit_number, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'Resident')
       RETURNING user_id, email, first_name, last_name, role`, [first_name, last_name, email, hashedPassword, phone_number, unit_number]);
        const token = (0, jwt_1.generateToken)(result.rows[0].user_id);
        res.status(201).json({
            token,
            user: result.rows[0]
        });
    }
    catch (error) {
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ message: 'Email already exists' });
        }
        else {
            res.status(500).json({ message: 'Server error' });
        }
    }
};
exports.register = register;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await database_1.default.query('SELECT user_id, email, first_name, last_name, role, phone_number, unit_number FROM Users WHERE user_id = $1', [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        const result = await database_1.default.query('SELECT password FROM Users WHERE user_id = $1', [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await database_1.default.query('UPDATE Users SET password = $1 WHERE user_id = $2', [hashedPassword, userId]);
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updatePassword = updatePassword;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { first_name, last_name, phone_number, unit_number } = req.body;
        const result = await database_1.default.query(`UPDATE Users 
       SET first_name = $1, last_name = $2, phone_number = $3, unit_number = $4
       WHERE user_id = $5
       RETURNING user_id, email, first_name, last_name, role, phone_number, unit_number`, [first_name, last_name, phone_number, unit_number, userId]);
        res.json({ user: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
