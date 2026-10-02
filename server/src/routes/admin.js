const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin endpoints strictly require ADMIN role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/analytics', adminController.getAdminAnalytics);
router.get('/rules', adminController.getAdminRules);
router.put('/rules/:id', adminController.updateAdminRule);
router.get('/users', adminController.getAdminUsers);

module.exports = router;
