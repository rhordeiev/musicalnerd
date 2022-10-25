const express = require('express');
const reviewController = require('../controllers/reviewController');

const reviewRouter = express.Router();

reviewRouter.post('/', reviewController.createReview);
reviewRouter.get('/', reviewController.findReviews);
reviewRouter.get('/:id', reviewController.getReview);
reviewRouter.get('/:id/likes', reviewController.getLikes);
reviewRouter.put('/', reviewController.changeReview);
reviewRouter.delete('/:id', reviewController.deleteReview);

module.exports = reviewRouter;
