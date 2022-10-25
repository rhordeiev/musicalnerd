const express = require('express');
const albumController = require('../controllers/albumController');

const albumRouter = express.Router();

albumRouter.post('/', albumController.createAlbum);
albumRouter.get('/popular', albumController.getPopular);
albumRouter.get('/nearest', albumController.getNearest);
albumRouter.get('/:id', albumController.findAlbum);
albumRouter.get('/:id/mark', albumController.getMark);
albumRouter.get('/:id/reactions', albumController.getReactions);
albumRouter.put('/', albumController.changeAlbum);
albumRouter.delete('/:id', albumController.deleteAlbum);

module.exports = albumRouter;
