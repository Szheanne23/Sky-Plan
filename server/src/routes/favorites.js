const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticateToken } = require('../middleware/auth');

// All favorite operations require authenticated user
router.use(authenticateToken);

router.get('/', favoritesController.getFavorites);
router.post('/', favoritesController.addFavorite);
router.delete('/:id', favoritesController.removeFavorite);

module.exports = router;
