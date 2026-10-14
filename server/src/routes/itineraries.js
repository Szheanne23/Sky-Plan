const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const { authenticateToken } = require('../middleware/auth');

// Public share route (no auth required)
router.get('/shared/:shareCode', itineraryController.getSharedItinerary);

// Protected routes (require user authentication)
router.get('/', authenticateToken, itineraryController.getItineraries);
router.post('/', authenticateToken, itineraryController.createItinerary);
router.get('/:id', authenticateToken, itineraryController.getItineraryById);
router.put('/:id', authenticateToken, itineraryController.updateItinerary);
router.delete('/:id', authenticateToken, itineraryController.deleteItinerary);

// Timeline Activity routes
router.post('/:id/activities', authenticateToken, itineraryController.addActivity);
router.put('/:id/activities/:activityId', authenticateToken, itineraryController.updateActivity);
router.delete('/:id/activities/:activityId', authenticateToken, itineraryController.deleteActivity);

// Share generation route
router.post('/:id/share', authenticateToken, itineraryController.shareItinerary);

module.exports = router;
