const express = require('express');
const { protect } = require('../../../infrastructure/middlewares/auth.middleware');
const checkRole = require('../../../infrastructure/middlewares/role.middleware');
const {
  getUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
  updateUser
} = require('../controllers/user.controller');

const router = express.Router();

// CRUD operations for users (admin only)
router.get('/', protect, checkRole('admin'), getUsers);
router.get('/:id', protect, checkRole('admin'), getUserById);
router.post('/', protect, checkRole('admin'), createUser);
router.put('/:id/role', protect, checkRole('admin'), updateUserRole);
router.put('/:id/', protect, checkRole('admin'), updateUserRole);
router.delete('/:id', protect, checkRole('admin'), deleteUser);

module.exports = router;
