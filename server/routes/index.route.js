import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import inventoryRoutes from './inventory.route';

const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount inventory routes at /inventory
router.use('/inventory', inventoryRoutes);

export default router;