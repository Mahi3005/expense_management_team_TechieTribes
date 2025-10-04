const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getManagers,
    getManagedUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);

router.get('/managers', getManagers); // Available to all authenticated users
router.get('/my-team', authorize('manager', 'admin'), getManagedUsers); // Manager and admin can access

// Admin only routes
router.use(authorize('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
