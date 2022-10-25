const express = require('express');
const imageController = require('../controllers/imageController');
const upload = require('../config/multer');

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), imageController.upload);
imageRouter.delete('/:avatar', imageController.remove);
imageRouter.get('/:avatar', imageController.get);

module.exports = imageRouter;
