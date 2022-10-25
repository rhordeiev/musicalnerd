const express = require('express');
const artistController = require('../controllers/artistController');

const artistRouter = express.Router();

artistRouter.post('/', artistController.createArtist);
artistRouter.get('/popular', artistController.getPopular);
artistRouter.get('/:id', artistController.findArtist);
artistRouter.get('/:id/albums', artistController.findArtistAlbums);
artistRouter.get('/:id/mark', artistController.getMark);
artistRouter.get('/:id/reactions', artistController.getReactions);
artistRouter.put('/', artistController.changeArtist);
artistRouter.delete('/:id', artistController.deleteArtist);

module.exports = artistRouter;
